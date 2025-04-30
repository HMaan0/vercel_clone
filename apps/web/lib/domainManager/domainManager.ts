interface domainManager {
  ip: string;
  domain: string;
  lastUsed: string;
}

export class DomainManager {
  private static instance: DomainManager;
  private domainManager: domainManager[] = [];
  private constructor() {}

  public static getInstance(): DomainManager {
    if (!DomainManager.instance) {
      DomainManager.instance = new DomainManager();
    }
    return DomainManager.instance;
  }

  public add(domainManager: domainManager) {
    this.domainManager.push(domainManager);
    //add db here
  }

  public delete(instanceIp: string) {
    const filterDomainManager = this.domainManager.filter(
      (domains) => domains.ip !== instanceIp
    );
    this.domainManager = filterDomainManager;
    //add db here
  }

  public updateDomain(instanceIp: string, domain: string) {
    this.domainManager.map((domains) => {
      if (domains.ip === instanceIp) {
        domains.domain = domain;
      }
    });
    //add db here
  }

  public updateTime(domain: string, time: string) {
    this.domainManager.map((domains) => {
      if (domains.domain === domain) {
        domains.lastUsed = time;
      }
    });
  }
}
