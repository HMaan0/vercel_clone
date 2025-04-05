"use server";
import { createClient } from "redis";

type QueuePushAdd = {
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
