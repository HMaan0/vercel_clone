// Modified server.js for your WebSocket server
import { NodeSSH } from "node-ssh";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { sshInstance } from "./functions/ssh";
import { subscribe } from "./functions/subscribe";
import http from "http";
dotenv.config();

const activeSessions = new Map();

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers
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

// Create WebSocket server with proper CORS handling
const ws = new WebSocketServer({
  server,
  perMessageDeflate: false,
});

console.log("WebSocket server starting on port 8080");

ws.on("connection", function connection(socket) {
  console.log("New connection established");
  let projectId = null;

  socket.on("error", console.error);
  socket.on("message", async (e) => {
    projectId = e.toString();
    console.log("Received message:", projectId);

    if (activeSessions.has(projectId)) {
      const existingLogs = activeSessions.get(projectId).logs;
      existingLogs.forEach(
        (
          log:
            | string
            | number
            | readonly any[]
            | ArrayBuffer
            | SharedArrayBuffer
            | Buffer<ArrayBufferLike>
            | DataView<ArrayBufferLike>
            | ArrayBufferView<ArrayBufferLike>
            | Uint8Array<ArrayBufferLike>
            | Blob
            | readonly number[]
            | { valueOf(): ArrayBuffer }
            | { valueOf(): SharedArrayBuffer }
            | { valueOf(): Uint8Array }
            | { valueOf(): readonly number[] }
            | { valueOf(): string }
            | { [Symbol.toPrimitive](hint: string): string }
        ) => {
          socket.send(log);
        }
      );
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

// Start the server
server.listen(8080, "0.0.0.0", () => {
  console.log(
    "WebSocket server is running on port 8080 and accepting connections from all interfaces"
  );
});
