import {
  DescribeAutoScalingInstancesCommand,
  SetDesiredCapacityCommand,
} from "@aws-sdk/client-auto-scaling";
import { DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { client, ec2Client } from "../lib/client";

// store this in redis
const ALL_IPS: {
  id: string;
  ip: string;
}[] = [];

export async function Up() {
  try {
    const command = new SetDesiredCapacityCommand({
      AutoScalingGroupName: "vercel-clone-asg",
      DesiredCapacity: ALL_IPS.length + 1,
    });
    const logs = await client.send(command);
    if (logs.$metadata.httpStatusCode === 200) {
      const newIp = await pollingNewIp(30, 5000);
      return newIp;
    } else {
      throw new Error("error creating new Instance" + logs);
    }
  } catch (error) {
    throw new Error("error creating client" + error);
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
    const instanceInfo = ec2Response.Reservations?.map((instances) =>
      instances.Instances?.map((instance) => {
        const id = instance.InstanceId;
        const ip = instance.NetworkInterfaces?.map(
          (x) => x.Association?.PublicIp
        )[0];
        return { id: id, ip: ip };
      })
    );
    const flattenedIpsIds = instanceInfo?.flat(2);
    if (
      Array.isArray(flattenedIpsIds) &&
      flattenedIpsIds.every(
        (flatId): flatId is { id: string; ip: string } =>
          typeof flatId === "object" &&
          flatId !== null &&
          typeof flatId.id === "string" &&
          typeof flatId.ip === "string"
      )
    ) {
      const totalIps = flattenedIpsIds.length > ALL_IPS.length;
      if (totalIps) {
        const allIpIds = ALL_IPS.map((item) => item.id);
        const newIp = flattenedIpsIds.filter(
          (flatId) => flatId && !allIpIds.includes(flatId.id)
        );
        ALL_IPS.push(...newIp);
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
