import { promises as dns } from "dns";
import { DomainManager } from "./domainManager/domainManager";
import dotenv from "dotenv";

dotenv.config();
export async function domainAvailable(newDomain: string): Promise<boolean> {
  try {
    if (process.env.DOMAIN && newDomain.endsWith(process.env.DOMAIN)) {
      const domainManager = DomainManager.getInstance();
      const domainExists = domainManager.checkDomainExist(newDomain);
      return domainExists;
    } else {
      const addresses = await dns.resolve4(newDomain);
      if (addresses && addresses.length > 0) {
        return false;
      }
      return true;
    }
  } catch {
    return true;
  }
}
