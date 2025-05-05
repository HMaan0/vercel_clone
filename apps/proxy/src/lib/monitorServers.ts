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
export async function monitorServers(domainManager: DomainManager) {
  if (!client.isOpen) {
    await client.connect();
  }
  while (true) {
    try {
      const servers = domainManager.readyForDowntime();
      for (let i = 0; i < servers.length; i++) {
        const queuePush = { ...servers[i], type: "down" };
        await client.lPush("project", JSON.stringify(queuePush));
        domainManager.updateDown(servers[i].ip, true);
        await prisma.domainEntry.update({
          where: { ip: servers[i].ip },
          data: {
            down: true,
          },
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000));
    } catch (error) {
      console.error("Error", error);
    }
  }
}
