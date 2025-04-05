import { NodeSSH } from "node-ssh";
import { git } from "../steps/git";
import { nginx } from "../steps/nginx";
import { WebSocket } from "ws";
import { runCommand } from "./runCommands";

type ProjectInfo = {
  userId: string;
  projectId: string;
  repo: string;
  lib: string;
  prisma: boolean;
  workingDir?: string;
  port: string;
  envs: string[];
  ip: string;
};
export async function sshInstance(
  ssh: NodeSSH,
  projectInfo: ProjectInfo,
  socket: WebSocket
) {
  try {
    let retries = 0;
    await connectInstance(ssh, projectInfo, retries);
    const nginxSteps = nginx(projectInfo.ip);
    const gitSteps = git(
      projectInfo.repo,
      projectInfo.envs,
      projectInfo.lib,
      projectInfo.prisma,
      projectInfo.port,
      projectInfo.workingDir
    );
    const commands = [...nginxSteps, ...gitSteps];
    for (const command of commands) {
      console.log(`Running: ${command}`);
      await runCommand(ssh, command, socket);
    }
    console.log("completed");
    ssh.dispose();
    socket.send(JSON.stringify(`complete: ${projectInfo.ip} `));
    socket.close();
  } catch (error) {
    console.error("Error:", error);
    socket.send(
      JSON.stringify(`Error deploying application ${projectInfo.repo}`)
    );
    socket.close();
  }
}

async function connectInstance(
  ssh: NodeSSH,
  projectInfo: ProjectInfo,
  retries: number
) {
  try {
    retries++;
    console.log(retries);
    await ssh.connect({
      host: projectInfo.ip,
      username: "ubuntu",
      privateKey: process.env.EC2_PRIVATE_KEY,
    });
  } catch (error) {
    console.error(error);
    if (retries < 15) {
      await connectInstance(ssh, projectInfo, retries);
    }
  }
}
