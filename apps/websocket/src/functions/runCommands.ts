import { NodeSSH } from "node-ssh";
import { WebSocket } from "ws";
import prisma from "@repo/db/src/client";
import { setTimeout } from "timers";

export async function runCommand(
  ssh: NodeSSH,
  command: string,
  projectId: string,
  bgLogs: string[],
  socket?: WebSocket,
  session?: { logs: string[]; socket?: WebSocket }
) {
  try {
    await ssh.execCommand(command, {
      onStdout(chunk) {
        const log = chunk.toString();
        if (session && socket) {
          session.logs.push(log);
          if (session.socket && session.socket.readyState === WebSocket.OPEN) {
            session.socket.send(log);
          } else if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(log);
          }
        } else {
          bgLogs.push(log);
        }
      },
      onStderr(chunk) {
        const log = chunk.toString();
        if (session && socket) {
          session.logs.push(log);

          if (session.socket && session.socket.readyState === WebSocket.OPEN) {
            session.socket.send(log);
          } else if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(log);
          }
        } else {
          bgLogs.push(log);
        }
      },
    });
    if (session) {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          logs: session.logs,
          State: "deployed",
        },
      });
    }
  } catch (error) {
    throw error;
  } finally {
    if (!session) {
      setTimeout(async () => {
        await prisma.project.update({
          where: { id: projectId },
          data: {
            logs: bgLogs,
            State: "deployed",
          },
        });
      }, 5000);
    }
  }
}
