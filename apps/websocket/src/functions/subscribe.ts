import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();
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
type Message = {
  request: ProjectInfo;
};
export async function subscribe(projectId: string): Promise<Message> {
  const redisClient = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: 18899,
    },
  });
  return new Promise(async (resolve, reject) => {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
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
