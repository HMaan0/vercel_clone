import { NodeSSH } from "node-ssh";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { sshInstance } from "./functions/ssh";
import { subscribe } from "./functions/subscribe";
dotenv.config();

const ws = new WebSocketServer({ port: 8080 });
console.log("HELLO");
ws.on("connection", function connection(socket) {
  socket.on("error", console.error);
  socket.on("message", async (e) => {
    let ssh = new NodeSSH();
    console.log(e.toString());

    const message = await subscribe(e);
    if (message) {
      await sshInstance(ssh, message, socket);
    }
  });
});

// socket.on("close", (ssh: NodeSSH) => {
//   if (ssh.isConnected()) {
//     ssh.dispose();
//   }
// });
