"use server";
import { promises as dns } from "dns";

export async function domainAvailable(newDomain: string): Promise<boolean> {
  try {
    if (process.env.DOMAIN && newDomain.endsWith(process.env.DOMAIN)) {
      //if: post to the db only
    } else {
      const addresses = await dns.resolve4(newDomain);
      if (addresses && addresses.length > 0) {
        return false;
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
