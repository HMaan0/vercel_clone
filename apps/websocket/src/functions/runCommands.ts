import { NodeSSH } from "node-ssh";
import { WebSocket } from "ws";

export async function runCommand(
  ssh: NodeSSH,
  command: string,
  socket: WebSocket
) {
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
