import dotenv from "dotenv";
dotenv.config();
import { Up } from "./function/up";

import { createClient } from "redis";
import { removeServer } from "./function/down";

const redisClient = createClient();

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
          const serverInfo = await Up();
          console.log(serverInfo);
          console.log(serverInfo[0].ip);
          console.log({ ...parsedRequest, ip: serverInfo[0].ip });
          const published = await redisClient.publish(
            parsedRequest.projectId,
            JSON.stringify({ ...parsedRequest, ip: serverInfo[0].ip })
          );
          console.log(published);
          // send this to Pub Sub & DB
          // if db goes down then project is added but db will not show project TODO: add roll back
        } else if (parsedRequest.type === "remove") {
          console.log("remove server");
          //const deleteServer = await removeServer(parsedRequest.instanceId);
          // check if it's deleted then
          // if db goes down then project is delete but db will show project
          // send this to DB
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
