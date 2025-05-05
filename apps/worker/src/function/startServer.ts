import { StartInstancesCommand } from "@aws-sdk/client-ec2";
import { client, ec2Client } from "../lib/client";
import { AttachInstancesCommand } from "@aws-sdk/client-auto-scaling";
import { currentDesiredInstances } from "./currentDesiredInstances";
import { IncreaseDesiredInstance } from "./IncreaseDesiredInstance";

export async function startServer(instanceId: string) {
  try {
    await startStoppedServer(instanceId);
    const desiredCapacity = await currentDesiredInstances();
    setTimeout(async () => {
      await IncreaseDesiredInstance(desiredCapacity + 1);
      const command = new AttachInstancesCommand({
        InstanceIds: [instanceId],
        AutoScalingGroupName: "vercel-clone-asg",
      });

      return client.send(command);
    }, 30 * 1000);
  } catch (error) {
    console.error("Error starting server", error);
  }
}

async function startStoppedServer(instanceId: string) {
  const command = new StartInstancesCommand({
    InstanceIds: [instanceId],
  });
  return ec2Client.send(command);
}
