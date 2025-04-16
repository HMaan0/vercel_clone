import { NodeSSH } from "node-ssh";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { sshInstance } from "./functions/ssh";
import { subscribe } from "./functions/subscribe";
import http from "http";
dotenv.config();

const activeSessions = new Map();

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  res.writeHead(404);
  res.end();
});

const ws = new WebSocketServer({
  server,
  perMessageDeflate: false,
});

ws.on("connection", function connection(socket) {
  console.log("New connection established");
  let projectId = null;

  socket.on("error", console.error);
  socket.on("message", async (e) => {
    projectId = e.toString();
    console.log("Received message:", projectId);

    if (activeSessions.has(projectId)) {
      console.log("it went in a session");
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
      console.log(projectId);

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

server.listen(8080, "0.0.0.0", () => {
  console.log(
    "WebSocket server is running on port 8080 and accepting connections from all interfaces"
  );
});
