import dotenv from "dotenv";
import prisma from "@repo/db/src/client";
import { Up } from "./function/up";
import { createClient } from "redis";
import { removeServer } from "./function/down";
import { Lib } from "@prisma/client";
dotenv.config();

type Request = {
  userId: string;
  projectId: string;
  repo: string;
  lib: string;
  prisma: boolean;
  port: string;
  workingDir: string;
  envs: string[];
  type: string;
  ip: string;
};
type ALL_IPS = {
  id: string;
  ip: string;
}[];

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 18899,
  },
});
console.log("ready");
async function queueWorker() {
  while (true) {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      const request = await redisClient.brPop("project", 0);
      if (request) {
        const parsedRequest = JSON.parse(request.element);

        if (parsedRequest.type === "add") {
          const checkProject = await prisma.project.findUnique({
            where: {
              id: parsedRequest.projectId,
            },
            select: {
              State: true,
            },
          });

          if (checkProject?.State === "processing") {
            const serverInfo = await Up();
            const request: Request = { ...parsedRequest, ip: serverInfo[0].ip };

            await redisClient.publish(
              request.projectId,
              JSON.stringify({ request, ip: serverInfo[0].ip })
            );

            await prisma.project.update({
              where: { id: request.projectId },
              data: {
                ip: request.ip,
                instanceId: serverInfo[0].id,
                repo: request.repo,
                lib: request.lib as Lib,
                prisma: request.prisma,
                port: request.port,
                workingDir: request.workingDir,
              },
            });
          } else if (checkProject?.State === "deployed") {
            const prevDeployment = await prisma.project.findUnique({
              where: { id: parsedRequest.projectId },
              select: {
                ip: true,
              },
            });
            const request: Request = {
              ...parsedRequest,
              ip: prevDeployment?.ip,
            };

            await redisClient.publish(
              request.projectId,
              JSON.stringify({ request, ip: prevDeployment?.ip })
            );

            await prisma.project.update({
              where: { id: request.projectId },
              data: {
                repo: request.repo,
                lib: request.lib as Lib,
                prisma: request.prisma,
                port: request.port,
                workingDir: request.workingDir,
              },
            });
            console.log(request);
          }

          // if db goes down then project is added but db will not show project TODO: add roll back
        } else if (parsedRequest.type === "remove") {
          console.log(parsedRequest.projectId);

          const instanceId = await prisma.project.findUnique({
            where: { id: parsedRequest.projectId },
            select: {
              instanceId: true,
            },
          });
          console.log(instanceId?.instanceId);
          if (instanceId?.instanceId) {
            await removeServer(instanceId.instanceId);
            const ALL_IPS = await redisClient.get("ALL_IPS");
            if (ALL_IPS) {
              const ips: ALL_IPS = await JSON.parse(ALL_IPS);
              if (ips.length === 1) {
                await redisClient.del("ALL_IPS");
              } else {
                const removeIp = ips.filter(
                  (id) => id.id !== instanceId.instanceId
                );
                const stringifyReducedALL_IPS = JSON.stringify(removeIp);
                await redisClient.set("ALL_IPS", stringifyReducedALL_IPS);
              }
            }
          }
          // check if it's deleted then change db
          // if db goes down then project is delete but db will show project
          await prisma.project.delete({
            where: { id: parsedRequest.projectId },
          });
        } else {
          return console.error("request type is nor add neither delete");
        }
      }
    } catch (error) {
      return console.error("Failed popping from queue", error);
    }
  }
}

queueWorker();
