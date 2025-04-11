"use client";
import { useEffect, useState, useRef } from "react";
import { useIpStore } from "../store/ipStore";
import Link from "next/link";

type LogType =
  | "docker"
  | "next"
  | "npm"
  | "error"
  | "success"
  | "warning"
  | "info"
  | "complete";

interface Log {
  text: string;
  type: LogType;
}

const WsClient = ({
  projectId,
  olderLogs,
  ip,
  loading,
}: {
  projectId: string;
  olderLogs: string[];
  ip: string | null;
  loading: boolean;
}) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const setDeploymentIp = useIpStore((state) => state.setDeploymentIp);
  const deploymentIp = useIpStore((state) => state.getDeploymentIp);
  const [time, setTime] = useState(0);
  const determineLogType = (logText: string): LogType => {
    const lowerCaseLog = logText.toLowerCase();

    if (lowerCaseLog.includes("complete:")) {
      return "complete";
    } else if (
      lowerCaseLog.includes("error") ||
      lowerCaseLog.includes("vulnerabilities") ||
      lowerCaseLog.includes("warning:")
    ) {
      return "error";
    } else if (
      lowerCaseLog.includes("docker") ||
      lowerCaseLog.includes("sha256:") ||
      lowerCaseLog.includes("extracting") ||
      lowerCaseLog.includes("exporting")
    ) {
      return "docker";
    } else if (
      lowerCaseLog.includes("next.js") ||
      lowerCaseLog.includes("▲ next.js")
    ) {
      return "next";
    } else if (
      lowerCaseLog.includes("npm") ||
      lowerCaseLog.includes("added packages")
    ) {
      return "npm";
    } else if (
      lowerCaseLog.includes("✓") ||
      lowerCaseLog.includes("done") ||
      lowerCaseLog.includes("success")
    ) {
      return "success";
    } else if (
      lowerCaseLog.includes("attention:") ||
      lowerCaseLog.includes("warn")
    ) {
      return "warning";
    } else {
      return "info";
    }
  };

  const extractIpAddress = (logText: string): string | undefined => {
    if (logText.includes("complete:")) {
      const ipMatch = logText.match(/complete:\s+(\d+\.\d+\.\d+\.\d+)/);
      return ipMatch ? ipMatch[1] : undefined;
    }
    return undefined;
  };

  const getLogColor = (type: LogType): string => {
    switch (type) {
      case "docker":
        return "text-blue-400";
      case "next":
        return "text-purple-400";
      case "npm":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      case "success":
        return "text-green-400";
      case "warning":
        return "text-orange-400";
      case "complete":
        return "text-teal-400";
      case "info":
      default:
        return "text-zinc-300";
    }
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    webSocket();
  }, [projectId, setDeploymentIp]);

  async function webSocket() {
    const newSocket = new WebSocket("ws://localhost:8080");

    newSocket.onopen = () => {
      console.log("Connection established");
      newSocket.send(projectId);
    };

    newSocket.onmessage = (message) => {
      const logText = message.data;
      const logType = determineLogType(logText);

      setLogs((prev) => [...prev, { text: logText, type: logType }]);

      if (logType === "complete") {
        const ipAddress = extractIpAddress(logText);
        if (ipAddress) {
          setDeploymentIp(projectId, ipAddress);
          console.log("Deployment IP stored:", ipAddress);
          newSocket.close();
          console.log("webSocket is closed");
          webSocket();
        }
      }
    };
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (logs.length > 0 || olderLogs.length > 0 || loading) {
      intervalId = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [loading, logs.length, olderLogs.length]);

  return (
    <>
      <div className="flex justify-center mt-6 flex-col items-center w-full">
        <div className="w-full max-w-2xl mb-6">
          <div className="w-full flex justify-between items-center mb-2">
            {logs.length > 0 || olderLogs.length > 0 || !loading ? (
              <>
                <p className="text-zinc-400 text-sm ">Deployment Logs</p>
              </>
            ) : (
              <>
                {" "}
                <div className="w-full flex justify-start items-center gap-4">
                  <p className="text-zinc-400 text-sm ">
                    deployment started{" "}
                    <span className="font-bold">{time} </span>
                    seconds ago
                  </p>
                </div>
                <p className="text-zinc-400 text-sm w-full text-right font-bold">
                  it takes less than 1 minute to show logs
                </p>
              </>
            )}
          </div>

          <div className="bg-zinc-900 rounded-lg border border-zinc-800 w-full h-80">
            <div
              ref={logContainerRef}
              className="overflow-y-scroll w-full h-full p-4 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900"
            >
              {logs.length > 0 ? (
                <>
                  {logs.map((log, index) => (
                    <div className="flex items-center gap-2" key={index}>
                      <p
                        className={`font-mono text-sm ${getLogColor(log.type)} break-all`}
                      >
                        {log.text}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {olderLogs?.map((log, index) => (
                    <div className="flex items-center gap-2" key={index}>
                      <p className={`font-mono text-sm break-all`}>{log}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        {ip ? (
          <>
            <div className="font-medium text-lg">
              Application deployed at{" "}
              <Link
                className="text-blue-400 font-mono p-1"
                href={`http://${ip}`}
                target="_blank"
              >
                {" "}
                http://{ip}
              </Link>
            </div>
          </>
        ) : (
          <>
            {deploymentIp(projectId) && (
              <>
                <div className="font-medium text-lg">
                  Application deployed at{" "}
                  <Link
                    className="text-blue-400 font-mono p-1"
                    href={`http://${deploymentIp(projectId)}`}
                    target="_blank"
                  >
                    {" "}
                    http://{deploymentIp(projectId)}
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default WsClient;
