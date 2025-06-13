import { NodeSSH } from "node-ssh";
import { git } from "../steps/git";
import { nginx } from "../steps/nginx";
import { WebSocket } from "ws";
import { runCommand } from "./runCommands";

type ProjectInfo = {
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
  isBgDeployment: Boolean,
  socket?: WebSocket,
  session?: {
    logs: string[];
    socket?: WebSocket;
    isRunning: boolean;
    completed?: boolean;
  },
  activeSessions?: Map<any, any>
) {
  let retries = 0;
  try {
    let bgLogs: string[] = [];
    await connectInstance(ssh, projectInfo, retries);

    let commands = [];
    if (isBgDeployment) {
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
      commands = [...gitSteps];
    } else {
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

      commands = [...nginxSteps, ...gitSteps];
    }
    for (const command of commands) {
      await runCommand(
        ssh,
        command,
        projectInfo.projectId,
        bgLogs,
        socket,
        session
      );
    }

    const completionMessage = JSON.stringify(`complete: ${projectInfo.ip} `);
    if (session && socket && activeSessions) {
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
    }
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = JSON.stringify(
      `Error deploying application ${projectInfo.repo} with ${retries} retries`
    );
    if (session && activeSessions) {
      session.logs.push(errorMessage);

      if (session.socket && session.socket.readyState === WebSocket.OPEN) {
        session.socket.send(errorMessage);
      } else if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(errorMessage);
      }

      session.isRunning = false;
      session.completed = true;
      activeSessions.delete(projectInfo.projectId);
    }
    try {
      ssh.dispose();
    } catch (e) {
      console.error("Error in disposing ssh", e);
    }
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
      await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
      await connectInstance(ssh, projectInfo, retries);
    }
  }
}
