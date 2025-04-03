// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import { Up } from "./function/up";
// import { TerminateInstanceInAutoScalingGroupCommand } from "@aws-sdk/client-auto-scaling";
// import { client } from "./lib/client";

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );

// app.get("/up", async (req, res) => {
//   try {
//     const newInstanceIp = await Up();
//     res.send(newInstanceIp);
//   } catch (error) {
//     res.send({ error: "Failed to start instance" });
//   }
// });

// app.get("/down/:instanceId", async (req, res) => {
//   try {
//     const { instanceId } = req.params;

//     const command = new TerminateInstanceInAutoScalingGroupCommand({
//       InstanceId: instanceId,
//       ShouldDecrementDesiredCapacity: true,
//     });

//     const response = client.send(command);
//     res.send(response);
//   } catch (error) {
//     res.send({ "Failed to stop instance": error });
//   }
// });

// const port = 3001;
// console.log("running on port: ", port);
// app.listen(port);

import { createClient } from "redis";

const client = createClient();

async function queueWorker() {
  while (true) {
    try {
      if (!client.isOpen) {
        await client.connect();
      }
      const request = await client.brPop("project", 0);
      if (request) {
        console.log(JSON.parse(request.element));
      }
    } catch (error) {
      return console.error("Failed popping from queue", error);
    }
  }
}

queueWorker();
