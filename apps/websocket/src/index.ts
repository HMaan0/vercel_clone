import { NodeSSH } from "node-ssh";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { sshInstance } from "./functions/ssh";
import { subscribe } from "./functions/subscribe";
import express from "express";
import cors from "cors";
import http from "http";
dotenv.config();

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
  console.log("New connection");
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
          socket,
          session,
          activeSessions
        );
      }
    }
  });
});

server.listen(8080, () => {
  console.log("WebSocket server is running on port 8080");
});
