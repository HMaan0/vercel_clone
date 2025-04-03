import { TerminateInstanceInAutoScalingGroupCommand } from "@aws-sdk/client-auto-scaling";
import { client } from "../lib/client";

export async function removeServer(instanceId: string) {
  try {
    const command = new TerminateInstanceInAutoScalingGroupCommand({
      InstanceId: instanceId,
      ShouldDecrementDesiredCapacity: true,
    });
    return client.send(command);
  } catch (error) {
    return console.error("Error adding server", error);
  }
}
