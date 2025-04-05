import { NodeSSH } from "node-ssh";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { sshInstance } from "./functions/ssh";
import { subscribe } from "./functions/subscribe";
dotenv.config();
const activeSessions = new Map();
const ws = new WebSocketServer({ port: 8080 });
console.log("HELLO");
ws.on("connection", function connection(socket) {
  let projectId: string | null = null;
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
