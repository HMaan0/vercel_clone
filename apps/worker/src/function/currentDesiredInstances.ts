import { DescribeAutoScalingGroupsCommand } from "@aws-sdk/client-auto-scaling";
import { client } from "../lib/client";

export async function currentDesiredInstances(): Promise<number> {
  const describeCommand = new DescribeAutoScalingGroupsCommand({
    AutoScalingGroupNames: ["vercel-clone-asg"],
  });

  const response = await client.send(describeCommand);

  if (!response.AutoScalingGroups || response.AutoScalingGroups.length === 0) {
    throw new Error(`Auto Scaling group vercel-clone-asg not found`);
  }

  const currentDesiredCapacity =
    response.AutoScalingGroups[0].DesiredCapacity || 0;
  return currentDesiredCapacity;
}
