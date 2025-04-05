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

const redisClient = createClient();
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
        console.log(parsedRequest);

        if (parsedRequest.type === "add") {
          const serverInfo = await Up();
          console.log(serverInfo);
          console.log(serverInfo[0].ip);
          const request: Request = { ...parsedRequest, ip: serverInfo[0].ip };

          const checkProject = await prisma.project.findUnique({
            where: {
              id: request.projectId,
            },
            select: {
              State: true,
            },
          });
          if (checkProject?.State === "processing") {
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
          }

          // if db goes down then project is added but db will not show project TODO: add roll back
        } else if (parsedRequest.type === "remove") {
          console.log("remove server");
          const deleteServer = await removeServer(parsedRequest.instanceId);
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
