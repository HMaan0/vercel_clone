import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { DomainManager } from "./domainManager/domainManager";
import dotenv from "dotenv";

dotenv.config();
interface NewEntry {
  ip: string;
  domain: string;
  lastUsed: string;
  down: boolean;
}

export async function generateSubDomain(ip: string): Promise<string> {
  const domainManager = DomainManager.getInstance();
  let { subDomain, exists } = generateAndCheck(domainManager);

  while (exists) {
    const result = generateAndCheck(domainManager, true);
    subDomain = result.subDomain;
    exists = result.exists;
  }

  const domain = subDomain + process.env.DOMAIN || ".localhost:4000";
  const newEntry: NewEntry = {
    ip: ip,
    domain,
    lastUsed: new Date().toISOString(),
    down: false,
  };
  domainManager.add(newEntry);

  return domain;
}

function generateAndCheck(domainManager: DomainManager, checked?: boolean) {
  let subDomain: string;

  if (checked) {
    subDomain = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: "-",
      length: 2,
      style: "lowerCase",
    });
  } else {
    subDomain = uniqueNamesGenerator({
      dictionaries: [colors, animals],
      separator: "-",
      length: 2,
      style: "lowerCase",
    });
  }

  const exists = domainManager.checkDomainExist(subDomain);
  return { subDomain, exists };
}
