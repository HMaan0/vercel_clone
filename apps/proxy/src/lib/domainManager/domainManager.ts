import prisma from "@repo/db/src/client";

interface domainManager {
  ip: string;
  domain: string | null;
  lastUsed: string | null;
  down: boolean | null;
}

export class DomainManager {
  private static instance: DomainManager;
  private domainManager: domainManager[] = [];
  private constructor() {
    this.domainManager = [];
  }

  public static getInstance(): DomainManager {
    if (!DomainManager.instance) {
      DomainManager.instance = new DomainManager();
    }
    return DomainManager.instance;
  }

  public async getDb() {
    try {
      const collection = await prisma.domainEntry.findMany({
        select: {
          ip: true,
          domain: true,
          lastUsed: true,
          down: true,
        },
      });

      if (collection && collection.length > 0) {
        const entries = collection.map((domains) => ({
          ip: domains.ip,
          domain: domains.domain,
          lastUsed: domains.lastUsed,
          down: domains.down,
        }));
        this.domainManager = [];
        this.domainManager = entries;
      } else {
        console.error("No domain entries found in database");
      }
    } catch (error) {
      console.error("Error fetching domain entries from database:", error);
    }
  }

  public async add(newEntry: domainManager) {
    this.domainManager.push(newEntry);
    const isDown = this.domainManager.find((domains) => {
      if (domains.ip === newEntry.ip) {
        return domains.down;
      }
      return false;
    });
    const down = isDown?.down;
    try {
      await prisma.domainEntry.update({
        where: { ip: newEntry.ip },
        data: {
          domain: newEntry.domain,
          lastUsed: new Date().toISOString(),
          down: down ?? false,
        },
      });
    } catch (error) {
      console.error("error adding new entry of domains in db", error);
    }
  }

  public async delete(instanceIp: string) {
    this.domainManager = this.domainManager.filter(
      (domains) => domains.ip !== instanceIp
    );
    try {
      await prisma.domainEntry.delete({
        where: {
          ip: instanceIp,
        },
      });
    } catch (error) {
      console.error("error deleting entry of domains in db", error);
    }
  }

  public async updateDomain(instanceIp: string, domain: string) {
    let ip: string | null = null;
    this.domainManager = this.domainManager.map((domains) => {
      if (domains.ip === instanceIp) {
        ip = instanceIp;
        return { ...domains, domain };
      } else if (domains.domain === instanceIp) {
        ip = domains.ip;
        return { ...domains, domain };
      } else {
        return domains;
      }
    });
    try {
      if (typeof ip === "string") {
        await prisma.domainEntry.update({
          where: {
            ip: ip,
          },
          data: {
            domain,
            lastUsed: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.error("error updating entry of domain in db", error);
    }
  }

  public updateTime(domain: string) {
    this.domainManager = this.domainManager.map((domains) => {
      if (domains.domain === domain) {
        return { ...domains, lastUsed: new Date().toISOString() };
      }
      return domains;
    });
  }

  public checkDomainExist(domain: string) {
    const domainExist = this.domainManager.find(
      (domains) => domains.domain === domain
    );
    if (domainExist) {
      return true;
    } else {
      return false;
    }
  }

  public getIp(domain: string) {
    const entry = this.domainManager.find(
      (domains) => domains.domain === domain
    );
    if (entry) {
      return "http://" + entry.ip;
    }
  }

  public readyForDowntime() {
    const entries = this.domainManager.filter((domains) => {
      if (!domains.down && domains.lastUsed) {
        const timeCurrent = new Date().toISOString();
        const timeDifference =
          new Date(timeCurrent).valueOf() -
          new Date(domains.lastUsed).valueOf();
        const minutesDifference = timeDifference / (1000 * 60);
        if (minutesDifference > 2) {
          return true;
        }
      }
      return false;
    });
    return entries;
  }

  public updateDown(ip: string, down: boolean) {
    this.domainManager = this.domainManager.map((domains) => {
      if (domains.ip === ip) {
        return { ...domains, down };
      }
      return domains;
    });
  }

  public checkStatus(domain: string) {
    const isDown = this.domainManager.filter((domains) => {
      if (domains.domain === domain) {
        return domains.down;
      }
    });
    if (isDown.length > 0) {
      return isDown[0].down;
    } else {
      return false;
    }
  }

  // REMOVE THIS
  public getAll() {
    return this.domainManager;
  }
}
