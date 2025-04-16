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
  port: string;
  envs: string[];
  ip: string;
  workingDir: string | null;
  buildCommand: string | null;
  installDep: string | null;
};

export async function sshInstance(
  ssh: NodeSSH,
  projectInfo: ProjectInfo,
  socket: WebSocket,
  session: {
    logs: string[];
    socket?: WebSocket;
    isRunning: boolean;
    completed?: boolean;
  },
  activeSessions: Map<any, any>
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
      projectInfo.workingDir,
      projectInfo.buildCommand,
      projectInfo.installDep
    );
    const commands = [...nginxSteps, ...gitSteps];
    for (const command of commands) {
      await runCommand(ssh, command, socket, session, projectInfo.projectId);
    }

    const completionMessage = JSON.stringify(`complete: ${projectInfo.ip} `);
    session.logs.push(completionMessage);

    if (session.socket && session.socket.readyState === WebSocket.OPEN) {
      session.socket.send(completionMessage);
    } else if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(completionMessage);
    }

    ssh.dispose();
    session.isRunning = false;
    session.completed = true;
    activeSessions.delete(projectInfo.projectId);
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = JSON.stringify(
      `Error deploying application ${projectInfo.repo}`
    );
    session.logs.push(errorMessage);

    if (session.socket && session.socket.readyState === WebSocket.OPEN) {
      session.socket.send(errorMessage);
    } else if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(errorMessage);
    }

    session.isRunning = false;
    session.completed = true;
    activeSessions.delete(projectInfo.projectId);
    try {
      ssh.dispose();
    } catch (e) {}
  }
}

async function connectInstance(
  ssh: NodeSSH,
  projectInfo: ProjectInfo,
  retries: number
) {
  try {
    retries++;
    await ssh.connect({
      host: projectInfo.ip,
      username: "ubuntu",

      privateKey: (process.env.EC2_PRIVATE_KEY || "").replace(/\/n/g, "\n"),
    });
  } catch (error) {
    if (retries < 15) {
      await connectInstance(ssh, projectInfo, retries);
    }
  }
}
