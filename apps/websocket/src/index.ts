import { NodeSSH } from "node-ssh";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";

import { git } from "./steps/git";
import { nginx } from "./steps/nginx";
dotenv.config();

//const repoLink = "https://github.com/HMaan0/viteTemplate.git";
const env: string[] = ["DATABASE_URL=random_url", "REDIS-url=redis_link"];
//const library = "vite";
const entryPoint = "src/index.js";
const prismaClient = true;
const port = "4000";

const ws = new WebSocketServer({ port: 8080 });
console.log("HELLO");
let ssh = new NodeSSH();
ws.on("connection", function connection(socket) {
  socket.on("error", console.error);
  socket.on("message", (e) => {
    const message = e.toString();
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    const library = parsedMessage.lib;
    const repoLink = parsedMessage.url;
    const ip = parsedMessage.ip;
    console.log(ip);
    async function main() {
      try {
        await ssh.connect({
          host: ip,
          username: "ubuntu",
          privateKey: process.env.EC2_PRIVATE_KEY,
        });
        console.log("Connected to EC2 instance");
        const nginxSteps = nginx(ip);
        const gitSteps = git(
          repoLink,
          env,
          library,
          entryPoint,
          prismaClient,
          port
        );
        const commands = [...nginxSteps, ...gitSteps];
        for (const command of commands) {
          console.log(`Running: ${command}`);
          await runCommand(command);
        }
        console.log("completed");
        ssh.dispose();
        socket.send(JSON.stringify(`complete: ${ip} `));
      } catch (error) {
        console.error("Error:", error);
      }
    }

    async function runCommand(command: string) {
      try {
        await ssh.execCommand(command, {
          onStdout(chunk) {
            socket.send(chunk.toString());
          },
          onStderr(chunk) {
            socket.send(chunk.toString());
          },
        });
      } catch (error) {
        throw error;
      }
    }
    main();
  });
  socket.on("close", () => {
    if (ssh.isConnected()) {
      ssh.dispose();
    }
  });
});
