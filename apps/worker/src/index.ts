import dotenv from "dotenv";
import prisma from "@repo/db/src/client";
import { Up } from "./function/up";
import { createClient } from "redis";
import { removeServer } from "./function/down";
import { Lib } from "@prisma/client";
import { stopServer } from "./function/stopServer";
import { startServer } from "./function/startServer";
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

const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 18899,
  },
});
async function queueWorker() {
  while (true) {
    try {
      if (!client.isOpen) {
        await client.connect();
      }
      const request = await client.brPop("project", 0);
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

            await client.publish(
              request.projectId,
              JSON.stringify({ request, ip: serverInfo[0].ip })
            );

            await prisma.domainEntry.upsert({
              where: { ip: request.ip },
              update: {},
              create: {
                ip: request.ip,
              },
            });

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

            await client.publish(
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
          }

          // if db goes down then project is added but db will not show project TODO: add roll back
        } else if (parsedRequest.type === "remove") {
          const instanceInfo = await prisma.project.findUnique({
            where: { id: parsedRequest.projectId },
            select: {
              instanceId: true,
            },
          });
          if (instanceInfo?.instanceId) {
            await removeServer(instanceInfo.instanceId);
            const ALL_IPS = await client.get("ALL_IPS");
            if (ALL_IPS) {
              const ips: ALL_IPS = await JSON.parse(ALL_IPS);
              if (ips.length === 1) {
                await client.del("ALL_IPS");
              } else {
                const removeIp = ips.filter(
                  (id) => id.id !== instanceInfo.instanceId
                );
                const stringifyReducedALL_IPS = JSON.stringify(removeIp);
                await client.set("ALL_IPS", stringifyReducedALL_IPS);
              }
            }
          }
          // check if it's deleted then change db
          // if db goes down then project is delete but db will show project
          await prisma.project.delete({
            where: { id: parsedRequest.projectId },
          });
        } else if (parsedRequest.type === "up") {
          try {
            const ip = parsedRequest.ip;
            const ALL_IPS = await client.get("ALL_IPS");
            if (ALL_IPS) {
              const ips: ALL_IPS = await JSON.parse(ALL_IPS);
              const instanceInfo = ips.filter(
                (instanceInfo) => instanceInfo.ip === ip
              );

              const instanceId = instanceInfo[0].id;

              await startServer(instanceId);
            }
          } catch (error) {
            console.error("Error trying to stop server", error);
          }
        } else if (parsedRequest.type === "down") {
          try {
            const ip = parsedRequest.ip;
            const ALL_IPS = await client.get("ALL_IPS");
            if (ALL_IPS) {
              const ips: ALL_IPS = await JSON.parse(ALL_IPS);
              const instanceInfo = ips.filter(
                (instanceInfo) => instanceInfo.ip === ip
              );
              const instanceId = instanceInfo[0].id;

              const stop = await stopServer(instanceId);
            }
          } catch (error) {
            console.error("Error trying to stop server", error);
          }
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
