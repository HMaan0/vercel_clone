"use server";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();
type QueuePushAdd = {
  projectId: string;
  repo: string;
  lib: string;
  prisma: boolean;
  workingDir?: string;
  port: string;
  envs?: string[];
};

const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 18899,
  },
});
client.on("error", (err) => console.log("redis client error", err));

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

export async function queuePushRemove(instanceId: string) {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    const queuePush = { instanceId, type: "remove" };
    await client.lPush("project", JSON.stringify(queuePush));
    return "Deployment Queued";
  } catch (error) {
    return error;
  } finally {
    client.disconnect();
  }
}
