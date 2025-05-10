import prisma from "@repo/db/src/client";
import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";
import { decryptEnv } from "../../../lib/decryptEnv";
const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 18899,
  },
});

const WEBHOOK_SECRET = "webhook_secret";
const prismaClient = prisma;
async function getAllRepos() {
  const allRepos = await prismaClient.project.findMany({
    where: {
      State: "deployed",
    },
    select: {
      repo: true,
    },
  });
  if (allRepos) {
    return allRepos;
  }
  return [];
}

async function readRawBody(req: Request): Promise<string> {
  const arrayBuffer = await req.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("utf8");
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await readRawBody(req);
    const payload = JSON.parse(rawBody);
    const signature = req.headers.get("x-hub-signature-256");
    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 401 }
      );
    }

    const hmac = createHmac("sha256", WEBHOOK_SECRET);
    const digest = "sha256=" + hmac.update(rawBody).digest("hex");

    try {
      const isValidSignature = timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
      );

      if (!isValidSignature) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Signature verification failed" },
        { status: 401 }
      );
    }

    const repoFullName = payload.repository?.full_name;
    if (!repoFullName) {
      return NextResponse.json(
        { error: "Repository information missing" },
        { status: 400 }
      );
    }
    const MONITORED_REPOSITORIES = await getAllRepos();
    const monitored = MONITORED_REPOSITORIES.map((r) => r.repo)
      .filter((repo): repo is string => typeof repo === "string")
      .map((repo) => new URL(repo).pathname.replace(/^\/|\.git$/g, ""));
    if (!monitored.includes(repoFullName)) {
      return NextResponse.json({ message: "Repository not monitored" });
    }

    const eventType = req.headers.get("x-github-event");
    if (eventType === "push") {
      const repoUrl = `https://github.com/${repoFullName}.git`;

      const deployments = await prismaClient.project.findMany({
        where: {
          repo: repoUrl,
        },
        select: {
          id: true,
          ip: true,
          instanceId: true,
          repo: true,
          lib: true,
          prisma: true,
          workingDir: true,
          port: true,
          State: true,
          installDep: true,
          buildCommand: true,
          envs: true,
        },
      });
      for (const deployment of deployments) {
        const {
          id,
          State,
          instanceId,
          ip,
          lib,
          port,
          repo,
          workingDir,
          installDep,
          buildCommand,
          prisma,
        } = deployment;

        const isValid =
          State === "deployed" &&
          typeof instanceId === "string" &&
          typeof ip === "string" &&
          typeof lib === "string" &&
          typeof port === "string" &&
          typeof repo === "string" &&
          typeof prisma === "boolean";
        if (isValid) {
          const envs = deployment.envs.map((env) => {
            const parts = env.split("=");
            if (parts.length < 2) return env;
            const key = parts[0];
            const value = parts.slice(1).join("=");
            const encryptedValue = decryptEnv(value);
            return `${key}=${encryptedValue}`;
          });
          const formData = {
            projectId: id,
            repo,
            lib,
            prisma: deployment.prisma ?? false,
            port,
            buildCommand,
            installDep,
            workingDir,
            ip,
            State,
            instanceId,
            envs,
          };
          if (!client.isOpen) {
            await client.connect();
          }
          await client.lPush("backgroundDeployment", JSON.stringify(formData));
          await prismaClient.project.update({
            where: {
              id: id,
            },
            data: {
              State: "processing",
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}
