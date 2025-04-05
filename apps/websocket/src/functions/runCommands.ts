import { NodeSSH } from "node-ssh";
import { WebSocket } from "ws";
import prisma from "@repo/db/src/client";

export async function runCommand(
  ssh: NodeSSH,
  command: string,
  socket: WebSocket,
  session: { logs: string[]; socket?: WebSocket },
  projectId: string
) {
  try {
    await ssh.execCommand(command, {
      onStdout(chunk) {
        const log = chunk.toString();
        session.logs.push(log);

        if (session.socket && session.socket.readyState === WebSocket.OPEN) {
          session.socket.send(log);
        } else if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(log);
        }
      },
      onStderr(chunk) {
        const log = chunk.toString();
        session.logs.push(log);

        if (session.socket && session.socket.readyState === WebSocket.OPEN) {
          session.socket.send(log);
        } else if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(log);
        }
      },
    });
    await prisma.project.update({
      where: { id: projectId },
      data: {
        logs: session.logs,
        State: "deployed",
      },
    });
  } catch (error) {
    throw error;
  }
}
