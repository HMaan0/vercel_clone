"use server";
import prisma from "@repo/db/src/client";
import axios from "axios";

export async function removeWebhook(
  accessToken: string,
  owner: string,
  projectId: string
) {
  const webhookUrl = `${process.env.NEXTAUTH_URL ?? "https://deployit.vercel.app"}/api/webhook`;
  const repo = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      repo: true,
    },
  });
  if (repo?.repo) {
    const rootDir = repo.repo
      .split("/")
      .pop()
      ?.replace(/\.git$/, "");
    const hooksRes = await axios.get(
      `https://api.github.com/repos/${owner}/${rootDir}/hooks`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const webhooks = hooksRes.data;

    const webhook = webhooks.find(
      (hook: { config: { url: string } }) => hook.config?.url === webhookUrl
    );
    if (!webhook) {
      return false;
    }

    const deleteUrl = `https://api.github.com/repos/${owner}/${rootDir}/hooks/${webhook.id}`;
    await axios.delete(deleteUrl, {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    return true;
  }
}
