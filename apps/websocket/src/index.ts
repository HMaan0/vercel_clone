import { NodeSSH } from "node-ssh";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { sshInstance } from "./functions/ssh";
import { subscribe } from "./functions/subscribe";
import express from "express";
import cors from "cors";
import http from "http";
import { createClient } from "redis";
dotenv.config();
const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 18899,
  },
});
const app = express();
app.use(
  cors({
    origin: [
      process.env.ORIGIN ?? "http://localhost:3000",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.use((req, res) => {
  res.send(404);
});
const server = http.createServer(app);
const activeSessions = new Map();
const ws = new WebSocketServer({
  server,
  perMessageDeflate: false,
});

ws.on("connection", function connection(socket) {
  let projectId = null;

  socket.on("error", console.error);
  socket.on("message", async (e) => {
    projectId = e.toString();

    if (activeSessions.has(projectId)) {
      const existingLogs = activeSessions.get(projectId).logs;
      existingLogs.forEach((log: string) => {
        socket.send(log);
      });
      activeSessions.get(projectId).socket = socket;
    } else {
      activeSessions.set(projectId, {
        socket: socket,
        logs: [],
        ssh: null,
      });
      const session = activeSessions.get(projectId);
      if (!session) return;
      let ssh = session.ssh || new NodeSSH();
      session.ssh = ssh;

      const message = await subscribe(projectId);
      if (message) {
        await sshInstance(
          ssh,
          message.request,
          false,
          socket,
          session,
          activeSessions
        );
      }
    }
  });
});

startBackgroundDeployments();

server.listen(8080, () => {
  console.log("WebSocket server is running on port 8080");
});

async function startBackgroundDeployments() {
  try {
    if (!client.isOpen) await client.connect();

    while (true) {
      try {
        const request = await client.brPop("backgroundDeployment", 0);
        if (!request) continue;
        const parsedRequest: ParsedRequest = JSON.parse(request.element);

        // if (activeSessions.size > 0) {
        //   // Re-queue it for later and retry
        //   await client.lPush(
        //     "backgroundDeployment",
        //     JSON.stringify(parsedRequest)
        //   );
        //   console.log("Active sessions present. Re-queued deployment.");
        //   await new Promise((r) => setTimeout(r, 5000));
        //   continue;
        // }

        const ssh = new NodeSSH();
        await sshInstance(ssh, parsedRequest, true);
      } catch (innerErr) {
        console.error("Error processing deployment:", innerErr);
        await new Promise((r) => setTimeout(r, 3000)); // Retry delay on failure
      }
    }
  } catch (error) {
    console.error("Failed to start background deployment processor:", error);
  }
}

type ParsedRequest = {
  projectId: string;
  repo: string;
  lib: string;
  prisma: boolean;
  port: string;
  envs: string[];
  ip: string;
  workingDir: string | null;
  buildCommand: string | null;
  installDep: string | null;
};
