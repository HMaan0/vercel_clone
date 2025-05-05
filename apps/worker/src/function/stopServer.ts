import { StopInstancesCommand } from "@aws-sdk/client-ec2";
import { client, ec2Client } from "../lib/client";
import { DetachInstancesCommand } from "@aws-sdk/client-auto-scaling";

export async function stopServer(instanceId: string) {
  try {
    await DetachServerASG(instanceId);
    const command = new StopInstancesCommand({
      InstanceIds: [instanceId],
    });

    return ec2Client.send(command);
  } catch (error) {
    console.error("Error stopping server", error);
  }
}

async function DetachServerASG(instanceId: string) {
  const command = new DetachInstancesCommand({
    InstanceIds: [instanceId],
    AutoScalingGroupName: "vercel-clone-asg",
    ShouldDecrementDesiredCapacity: true,
  });
  return client.send(command);
}
