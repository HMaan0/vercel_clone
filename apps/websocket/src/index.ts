import { NodeSSH } from "node-ssh";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";

import { git } from "./steps/git";
dotenv.config();
const sshConfig = {
  host: "35.182.253.19",
  username: "ubuntu",
  privateKey: process.env.EC2_PRIVATE_KEY,
};

let ssh = new NodeSSH();
const repoLink = "https://github.com/HMaan0/nodedum.git";
const env = [
  "DATABASE_URL=postgresql://neondb_owner:yUZK7h3sbHJi@ep-blue-union-a5b5lguy-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
];
const library = "node";
const entryPoint = "src/index.js";
const prismaClient = true;
const port = "4000";

const ws = new WebSocketServer({ port: 3000 });
console.log("HELLO");
ws.on("connection", function connection(socket) {
  socket.on("error", console.error);
  socket.on("message", (e) => {
    async function main() {
      try {
        await ssh.connect(sshConfig);
        console.log("Connected to EC2 instance");

        //const nginxSteps =  nginx("35.183.65.251", port);
        const gitSteps = await git(
          repoLink,
          env,
          library,
          entryPoint,
          prismaClient,
          port
        );
        //const commands = [...nginxSteps, ...gitSteps];
        const commands = [...gitSteps];
        for (const command of commands) {
          console.log(`Running: ${command}`);
          await runCommand(command);
        }
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
});

// finally {
//   ssh.dispose();
//   console.log("Disconnected from EC2");
// }

// async function runCommand(command: string) {
//   return new Promise<void>(async (resolve, reject) => {
//     try {
//       const stream = await ssh.exec(command, [], {
//         stream: "both",
//         onStdout(chunk) {
//           process.stdout.write(chunk.toString()); // Live output
//         },
//         onStderr(chunk) {
//           process.stderr.write(chunk.toString()); // Live error output
//         },
//       });
//       resolve();
//     } catch (error) {
//       reject(error);
//     }
//   });
// }
