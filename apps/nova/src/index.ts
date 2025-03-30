import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Up } from "./function/up";
import { TerminateInstanceInAutoScalingGroupCommand } from "@aws-sdk/client-auto-scaling";
import { client } from "./lib/client";

const app = express();

app.get("/up", async (req, res) => {
  try {
    const newInstanceIp = await Up();
    res.send(newInstanceIp);
  } catch (error) {
    res.send({ error: "Failed to start instance" });
  }
});

app.get("/down/:instanceId", async (req, res) => {
  try {
    const { instanceId } = req.params;

    const command = new TerminateInstanceInAutoScalingGroupCommand({
      InstanceId: instanceId,
      ShouldDecrementDesiredCapacity: true,
    });

    const response = client.send(command);
    res.send(response);
  } catch (error) {
    res.send({ "Failed to stop instance": error });
  }
});

const port = 3000;
console.log("running on port: ", port);
app.listen(port);
