"use server";
import { createClient } from "redis";

type QueuePush = {
  userId: string;
  projectId: string;
  repo: string;
  lib: string;
  prisma: boolean;
  workingDir?: string;
  port: string;
  envs?: string[];
};

const client = createClient();
client.on("error", (err) => console.log("redis client error", err));

export async function queuePush(queuePush: QueuePush) {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    console.log(queuePush);
    await client.lPush("project", JSON.stringify(queuePush));
    return "Deployment Queued";
  } catch (error) {
    return error;
  }
}
