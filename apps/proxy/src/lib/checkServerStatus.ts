import prisma from "@repo/db/src/client";
import { DomainManager } from "./domainManager/domainManager";
import { createClient } from "redis";
const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 18899,
  },
});
client.on("error", (err) => console.error("redis client error", err));
export async function checkServerStatus(
  host: string,
  target: string | undefined,
  domainManager: DomainManager
) {
  if (!client.isOpen) {
    await client.connect();
  }
  const isDown = domainManager.checkStatus(host);
  if (isDown && target) {
    const ip = target.split("//")[1];
    const queuePush = { ip, host, type: "up" };
    await client.lPush("project", JSON.stringify(queuePush));
    domainManager.updateDown(ip, false);
    await prisma.domainEntry.update({
      where: { ip: ip },
      data: {
        down: false,
      },
    });
  }
}
