import { SetDesiredCapacityCommand } from "@aws-sdk/client-auto-scaling";
import { client } from "../lib/client";

export async function IncreaseDesiredInstance(currentDesiredCapacity: number) {
  const updateCommand = new SetDesiredCapacityCommand({
    AutoScalingGroupName: "vercel-clone-asg",
    DesiredCapacity: currentDesiredCapacity + 1,
  });
  return client.send(updateCommand);
}
