import {
  DescribeAutoScalingInstancesCommand,
  SetDesiredCapacityCommand,
} from "@aws-sdk/client-auto-scaling";
import { DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { client, ec2Client } from "../lib/client";

const ALL_IPS: string[] = [];

export async function Up() {
  try {
    const command = new SetDesiredCapacityCommand({
      AutoScalingGroupName: "vercelClone_group",
      DesiredCapacity: ALL_IPS.length + 1,
    });
    const logs = await client.send(command);
    if (logs.$metadata.httpStatusCode === 200) {
      const newIp = await pollingNewIp(30, 5000);
      return newIp;
    } else {
      return { "error creating new Instance": logs };
    }
  } catch (error) {
    return { "error creating client": error };
  }
}

async function getInstances() {
  const instanceCommand = new DescribeAutoScalingInstancesCommand();
  const data = await client.send(instanceCommand);
  const instanceIds = data.AutoScalingInstances?.map((x) => x.InstanceId);
  if (
    Array.isArray(instanceIds) &&
    instanceIds.every((id) => typeof id === "string")
  ) {
    const ec2InstanceCommand = new DescribeInstancesCommand({
      InstanceIds: instanceIds,
    });

    const ec2Response = await ec2Client.send(ec2InstanceCommand);

    const Ips = ec2Response.Reservations?.map((instances) =>
      instances.Instances?.map((instance) =>
        instance.NetworkInterfaces?.map((x) => x.Association?.PublicIp)
      )
    );

    const flattenedIps = Ips?.flat(2);
    if (flattenedIps && flattenedIps.every((ip) => typeof ip === "string")) {
      const totalIps = flattenedIps.length > ALL_IPS.length;
      if (totalIps) {
        const newIp = flattenedIps.filter((ip) => !ALL_IPS.includes(ip))[0];
        ALL_IPS.push(newIp);
        return newIp;
      }
    }
  }
}

async function pollingNewIp(maxRounds: number, delay: number) {
  for (let round = 0; round < maxRounds; round++) {
    const newIp = await getInstances();
    if (newIp) {
      return newIp;
    }
    if (round < maxRounds - 1) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Failed to get new instance IP after maximum attempts");
}
