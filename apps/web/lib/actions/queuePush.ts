"use server";
import { createClient } from "redis";
import dotenv from "dotenv";
import axios from "axios";
import prisma from "@repo/db/src/client";

dotenv.config();
type QueuePushAdd = {
  projectId: string;
  repo: string;
  lib: string;
  prisma: boolean;
  port: string;
  envs?: string[];
  buildCommand: string | null;
  installDep: string | null;
  workingDir: string | null;
};

const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 18899,
  },
});
client.on("error", (err) => console.error("redis client error", err));

export async function queuePushAdd(queuePushAdd: QueuePushAdd) {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    const queuePush = { ...queuePushAdd, type: "add" };
    await client.lPush("project", JSON.stringify(queuePush));
    return "Deployment Queued";
  } catch (error) {
    return error;
  } finally {
    client.disconnect();
  }
}

export async function queuePushRemove(projectId: string) {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    const queuePush = { projectId, type: "remove" };
    await client.lPush("project", JSON.stringify(queuePush));
    const instanceIp = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        ip: true,
      },
    });
    if (instanceIp?.ip) {
      const ip: string = instanceIp.ip;
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}delete`, {
        data: { ip },
      });
    }
    return "Deployment Queued";
  } catch (error) {
    return error;
  } finally {
    client.disconnect();
  }
}
