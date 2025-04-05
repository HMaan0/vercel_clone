"use client";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { queuePushAdd } from "../lib/actions/queuePush";

const WsClient = ({ projectId }: { projectId: string }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");
    newSocket.onopen = () => {
      console.log("connection established");
      newSocket.send(projectId);
    };

    setSocket(newSocket);
    newSocket.onmessage = (message) => {
      console.log(message.data);
      setLogs((prev) => [...prev, message.data]);
    };
  }, [projectId]);

  async function handleClick() {
    const queueInfo = {
      userId: "1",
      projectId,
      repo: "https://github.com/HMaan0/nodedum.git",
      lib: "node",
      prisma: false,
      port: "4000",
      workingDir: "src/index.js",
      envs: [],
    };

    const res = await queuePushAdd(queueInfo);
    console.log(res);
  }
  async function handleRemove() {
    console.log(projectId);
  }
  return (
    <>
      <div className="flex justify-center gap-5 mt-10 flex-col items-center w-full h-full">
        <Button onClick={handleClick}>deploy</Button>
        <Button onClick={handleRemove}>remove</Button>
        <div className="rounded-lg border border-gray-400  w-4/5 md:w-1/2 h-80 py-1.5 ">
          <div className="overflow-y-scroll w-full h-full px-2 flex flex-col gap-2">
            {logs.map((log, index) => (
              <div className="flex w-full items-center gap-1" key={index}>
                <p className="rounded-full bg-blue-500/30 px-2 text-center">
                  {index}
                </p>
                <p className="font-mono font-medium">{log}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WsClient;
