"use client";
import { useEffect, useState, useRef } from "react";
import { useIpStore } from "../store/ipStore"; // Update this path as needed
import Link from "next/link";

// Define different log types for color coding
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

const WsClient = ({ projectId }: { projectId: string }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const setDeploymentIp = useIpStore((state) => state.setDeploymentIp);
  const deploymentIp = useIpStore((state) => state.getDeploymentIp);

  // Function to determine log type based on content
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

  // Function to extract IP address from complete log
  const extractIpAddress = (logText: string): string | undefined => {
    if (logText.includes("complete:")) {
      // The match method returns RegExpMatchArray | null
      const ipMatch = logText.match(/complete:\s+(\d+\.\d+\.\d+\.\d+)/);
      // If ipMatch is not null, return the captured group, otherwise return null
      return ipMatch ? ipMatch[1] : undefined;
    }
    return undefined;
  };

  // Function to get text color based on log type
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

  // Auto-scroll effect
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // WebSocket connection effect
  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");

    newSocket.onopen = () => {
      console.log("Connection established");
      newSocket.send(projectId);
    };

    newSocket.onmessage = (message) => {
      const logText = message.data;
      const logType = determineLogType(logText);

      // Store the log
      setLogs((prev) => [...prev, { text: logText, type: logType }]);

      // Check if this is the completion log with IP address
      if (logType === "complete") {
        const ipAddress = extractIpAddress(logText);
        if (ipAddress) {
          setDeploymentIp(projectId, ipAddress);
          console.log("Deployment IP stored:", ipAddress);
        }
      }
    };

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [projectId, setDeploymentIp]);

  return (
    <>
      <div className="flex justify-center mt-6 flex-col items-center w-full">
        <div className="w-full max-w-2xl mb-6">
          <p className="text-zinc-400 text-sm mb-2">Deployment Logs</p>
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 w-full h-80">
            <div
              ref={logContainerRef}
              className="overflow-y-scroll w-full h-full p-4 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900"
            >
              {logs.map((log, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <p
                    className={`font-mono text-sm ${getLogColor(log.type)} break-all`}
                  >
                    {log.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
      </div>
    </>
  );
};

export default WsClient;
