import express from "express";
import { generateSubDomain } from "./lib/generateSubDomain";
import { domainAvailable } from "./lib/domainAvailable";
import { DomainManager } from "./lib/domainManager/domainManager";
import {
  createProxyMiddleware,
  RequestHandler as ProxyRequestHandler,
} from "http-proxy-middleware";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const proxyMap = new Map<string, ProxyRequestHandler>();
const domainManager = DomainManager.getInstance();
domainManager.getDb();
//monitorServers(domainManager);
app.use(express.json());

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.post("/create", async (req, res) => {
  try {
    const { ipAddress } = req.body;

    if (ipAddress) {
      const subDomain = await generateSubDomain(ipAddress);
      res.json(subDomain);
    } else {
      res.json("Ip is missing");
    }
  } catch (error) {
    console.error("error creating subdomain: ", error);
  }
});

app.put("/update", async (req, res) => {
  try {
    const { newDomain, instanceIp } = req.body;
    const domainExist = await domainAvailable(newDomain);
    const domainIsAvailable = !domainExist;

    if (domainIsAvailable) {
      domainManager.updateDomain(instanceIp, newDomain);
    }
    res.json(domainIsAvailable);
  } catch (error) {
    console.error("error updating domain: ", error);
  }
});

app.delete("/delete", (req, res) => {
  try {
    const { ip } = req.body;

    domainManager.delete(ip);

    res.json("entry deleted");
  } catch (error) {
    console.error("error deleting entry");
  }
});
app.use(async (req, res, next) => {
  const host = req.headers.host;
  if (!host) return next();
  const target = domainManager.getIp(host);

  if (!target) return next();

  //await checkServerStatus(host, target, domainManager);
  if (!proxyMap.has(target)) {
    const proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        "^/": "/",
      },
    });

    proxyMap.set(target, proxy);
  }

  const proxy = proxyMap.get(target);
  domainManager.updateTime(host);
  return proxy!(req, res, next);
});

const PORT = 4000;
app.listen(PORT, () => console.log("Server is running on port: ", PORT));
