"use client";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { queuePushAdd, queuePushRemove } from "../lib/actions/queuePush";

const WsClient = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lib, setLib] = useState("");
  const [url, setUrl] = useState("");
  const [machine, setMachine] = useState<null | [{ id: string; ip: string }]>(
    null
  );

  // useEffect(() => {
  //   async function main() {
  //     const machineInfo = await axios("http://localhost:3001/up");
  //     console.log(machineInfo);
  //     setMachine(machineInfo.data);
  //   }
  //   main();

  //   const newSocket = new WebSocket("ws://localhost:8080");
  //   newSocket.onopen = () => {
  //     console.log("connection established");
  //   };
  //   setSocket(newSocket);
  //   newSocket.onmessage = (message) => {
  //     console.log(message.data);
  //     setLogs((prev) => [...prev, message.data]);
  //   };
  // }, []);

  async function handleClick() {
    // console.log(machine);
    // if (machine) {
    //   const ip = machine[0].ip;
    //   const info = { lib, url, ip };
    //   console.log(ip);
    //   socket?.send(JSON.stringify(info));
    // }
    const queueInfo = {
      userId: "1",
      projectId: "1",
      repo: "https://github.com/hmaan0/nodenum.git",
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
    const instanceId = "asdasdasd";
    const res = await queuePushRemove(instanceId);
    console.log(res);
  }
  return (
    <>
      <div className="flex justify-center gap-5 mt-10 flex-col items-center w-full h-full">
        <input
          onChange={(e) => setLib(e.target.value)}
          placeholder="Library"
          className="border-gray-400 rounded-lg border py-1.5 px-3 focus:outline-0"
        ></input>
        <input
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Github url"
          className="border-gray-400 rounded-lg border py-1.5 px-3 focus:outline-0"
        ></input>{" "}
        {/* <input placeholder="env"></input> */}
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
