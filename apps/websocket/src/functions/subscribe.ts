import { createClient } from "redis";
import { RawData } from "ws";

type ProjectInfo = {
  userId: string;
  projectId: string;
  repo: string;
  lib: string;
  prisma: boolean;
  workingDir?: string;
  port: string;
  envs: string[];
  ip: string;
};
export async function subscribe(e: RawData): Promise<ProjectInfo> {
  const redisClient = createClient();
  return new Promise(async (resolve, reject) => {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }

      const projectId = e.toString();
      console.log("Subscribed to:", projectId);

      await redisClient.subscribe(projectId, (message) => {
        console.log("Received message:", message);
        resolve(JSON.parse(message));
      });
    } catch (error) {
      reject(error);
    }
  });
}
