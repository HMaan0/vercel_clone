"use client";

import { useState, useEffect } from "react";
import WsClient from "./WsClient";
import { queuePushAdd } from "../lib/actions/queuePush";
import { FaChevronDown, FaGithub } from "react-icons/fa";
import Link from "next/link";
import { getProject } from "../lib/actions/getProjects";
import { useIpStore } from "../store/ipStore";
import { useSession } from "next-auth/react";
import { getRepos } from "../lib/actions/getRepos";
import React from "react";
import Error from "./Error";
import EditDomain from "./EditDomain";
type Repos = {
  name: string;
  private: boolean;
  owner: string;
}[];
const Input = ({ projectId }: { projectId: string }) => {
  const deploymentIp = useIpStore((state) => state.getDeploymentIp);
  const removeIp = useIpStore((state) => state.removeDeployment);
  const deploymentIps = useIpStore((state) => state.deploymentIps);
  const [envVars, setEnvVars] = useState([{ key: "", value: "" }]);
  const [selectedFramework, setSelectedFramework] = useState("next");
  const [showFrameworkOptions, setShowFrameworkOptions] = useState(false);
  const [generatePrisma, setGeneratePrisma] = useState(false);
  const [port, setPort] = useState("3000");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [deployed, setDeployed] = useState(false);
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repos | []>([]);
  const [rootDirectory, setRootDirectory] = useState<string | null>(null);
  const [installDep, setInstallDep] = useState<string | null>(null);
  const [buildCommand, setBuildCommand] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [olderLogs, setOlderLogs] = useState<string[]>([]);
  const [ip, setIp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sampleProject, setSampleProject] = useState(false);
  const [inputRepo, setInputRepo] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    projectId,
    repo: inputRepo ? inputRepo : selectedRepo,
    lib: selectedFramework,
    prisma: generatePrisma,
    port: port,
    envs: [] as string[],
    workingDir: rootDirectory,
    installDep,
    buildCommand,
  });

  useEffect(() => {
    async function main() {
      if (session?.accessToken) {
        const allRepos = await getRepos(
          session.accessToken,
          session.user.username
        );
        if (allRepos) {
          setRepos(allRepos);
        }
      }
    }
    main();
  }, [session?.accessToken, session?.user.username]);

  useEffect(() => {
    const formattedEnvVars = envVars
      .filter((env) => env.key.trim() !== "" && env.value.trim() !== "")
      .map((env) => `${env.key}=${env.value}`);

    setFormData({
      projectId,
      repo: inputRepo
        ? inputRepo
        : sampleProject
          ? "https://github.com/HMaan0/sample.git"
          : `https://github.com/${session?.user.username}/${selectedRepo}.git`,
      lib: selectedFramework,
      prisma: generatePrisma,
      port: port,
      workingDir: rootDirectory,
      envs: formattedEnvVars.length > 0 ? formattedEnvVars : [],
      installDep,
      buildCommand,
    });
  }, [
    envVars,
    selectedFramework,
    generatePrisma,
    port,
    rootDirectory,
    projectId,
    selectedRepo,
    installDep,
    buildCommand,
    sampleProject,
    inputRepo,
  ]);

  useEffect(() => {
    async function main() {
      const projectInfo = await getProject(projectId);
      if (projectInfo?.State === "deployed") {
        setPort(projectInfo.port || port);
        setSelectedFramework(projectInfo.lib);
        setGeneratePrisma(projectInfo.prisma || generatePrisma);
        setRootDirectory(projectInfo.workingDir || rootDirectory);
        setSelectedRepo(
          projectInfo.repo?.split("/")[4]?.split(".")[0] || selectedRepo
        );
        setOlderLogs(projectInfo.logs);
        setIp(projectInfo.ip);
        setDeployed(true);
        if (projectInfo.domain?.domain) {
          setDomain(projectInfo.domain?.domain);
        }
      }
    }
    main();
  }, []);

  const addMoreEnvVars = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };
  const removeLastEnvVars = () => {
    if (envVars.length > 1 && envVars) {
      const removedEnv = envVars.slice(0, envVars.length - 1);
      setEnvVars(removedEnv);
    } else {
      setEnvVars([{ key: "", value: "" }]);
    }
  };

  const handleEnvChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedEnvVars = [...envVars].map((item) => ({ ...item }));

    if (updatedEnvVars[index]) {
      updatedEnvVars[index][field] = value;
      setEnvVars(updatedEnvVars);
    }
  };

  const selectFramework = (framework: string) => {
    setSelectedFramework(framework);
    setShowFrameworkOptions(false);
  };

  async function handleDeployment() {
    if (selectedRepo.length > 0 || sampleProject || inputRepo) {
      await queuePushAdd(formData);
      setLoading(true);
    } else {
      setError("selected a Repository from top");
    }
    if (deploymentIp(projectId)) {
      removeIp(projectId);
    }
  }

  useEffect(() => {
    if (deploymentIp(projectId)) {
      setLoading(false);
    }
  }, [deploymentIp, deploymentIps, projectId]);

  const clearError = () => {
    setError(null);
  };

  async function handleSampleCheck() {
    setSampleProject(!sampleProject);
    if (sampleProject) {
      setSelectedRepo("https://github.com/HMaan0/sample.git");
      setSelectedFramework("next");
      setPort("3000");
      setGeneratePrisma(false);
      setEnvVars([]);
      setRootDirectory(null);
      setInstallDep(null);
      setBuildCommand(null);
    } else {
      setSelectedRepo("");
    }
  }

  const disabledWhenSample = sampleProject ? { disabled: true } : {};

  return (
    <>
      <div className="flex flex-col gap-5 py-5 items-center justify-center min-h-screen bg-black">
        <div className="w-full max-w-2xl bg-zinc-950 rounded-lg p-6 text-white">
          <EditDomain ip={ip} domain={domain} projectId={projectId} />
          <div className="bg-zinc-900 rounded p-4 mb-6">
            <p className="text-zinc-400 text-sm mb-2">Importing from GitHub</p>
            <div className="flex items-center lg:flex-row flex-col gap-2">
              {session?.accessToken ? (
                <>
                  <FaGithub size={25} />
                  <div className="relative">
                    {repos.length > 0 ? (
                      <>
                        <button
                          onClick={() =>
                            !sampleProject && setIsDropdownOpen(!isDropdownOpen)
                          }
                          className={`flex items-center gap-2 ${!sampleProject ? "hover:bg-zinc-800" : "opacity-50 cursor-not-allowed"} px- py-1 rounded`}
                          {...disabledWhenSample}
                        >
                          <span className="font-mono">
                            {session?.user.username}/
                            {sampleProject
                              ? "sample"
                              : inputRepo
                                ? inputRepo
                                : selectedRepo}
                          </span>
                          <FaChevronDown
                            size={12}
                            className={`text-zinc-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={`flex items-center gap-2 py-1 rounded ${sampleProject ? "opacity-50 cursor-not-allowed" : ""}`}
                          {...disabledWhenSample}
                        >
                          <span className="font-mono">
                            {session?.user.username}/
                            {sampleProject
                              ? "sample"
                              : inputRepo
                                ? inputRepo
                                : selectedRepo}
                          </span>
                        </button>
                      </>
                    )}

                    {isDropdownOpen && !sampleProject && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-zinc-800 rounded shadow-lg z-10 h-80 overflow-y-scroll">
                        {repos.map((repo, index) => (
                          <React.Fragment key={index}>
                            <div
                              className="font-mono px-3 py-2 hover:bg-zinc-700 cursor-pointer"
                              onClick={() => {
                                setSelectedRepo(repo.name);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {repo.name}
                            </div>
                            <div className="border-b border-gray-600/50"></div>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-zinc-500 lg:block hidden">|</span>
                  <Link
                    href={`https://github.com/${session?.user.username}/${sampleProject ? "sample" : inputRepo ? inputRepo : selectedRepo}`}
                    target="_blank"
                    className={
                      sampleProject ? "opacity-50 pointer-events-none" : ""
                    }
                    {...(sampleProject ? { tabIndex: -1 } : {})}
                  >
                    <span className="font-mono text-zinc-500 text-xs xl:text-sm">
                      https://github.com/{session?.user.username}/
                      {sampleProject ? "sample" : selectedRepo}
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex w-full flex-col justify-between gap-2">
                    <div className="w-full flex items-center bg-zinc-900 rounded px-4 py-3 border border-zinc-800">
                      <input
                        type="checkbox"
                        id="sample-project"
                        checked={sampleProject}
                        onChange={handleSampleCheck}
                        className="mr-3 h-4 w-4 accent-zinc-500"
                      />
                      <label htmlFor="sample-project">
                        Use a sample nextjs app
                      </label>
                    </div>
                    <div className="flex gap-5 w-full justify-center items-center">
                      <div className="border-b border-zinc-700 w-full"></div>
                      <span className="text-zinc-700">OR</span>
                      <div className="border-b border-zinc-700 w-full"></div>
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-xs text-zinc-400/50">
                        Enter github repository url
                      </label>
                      <input
                        type="text"
                        placeholder="https://github.com/user/repo.git"
                        onChange={(e) => setInputRepo(e.target.value)}
                        className={`w-full bg-zinc-800/20 rounded px-3 py-2 border border-zinc-700 text-white ${sampleProject ? "opacity-50" : ""}`}
                        {...disabledWhenSample}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div
              className={`flex items-center bg-zinc-900 rounded px-4 py-3 border border-zinc-800 ${sampleProject ? "opacity-50" : ""}`}
            >
              <input
                type="checkbox"
                id="generate-prisma"
                checked={generatePrisma}
                onChange={(e) => setGeneratePrisma(e.target.checked)}
                className="mr-3 h-4 w-4 accent-zinc-500"
                {...disabledWhenSample}
              />
              <label
                htmlFor="generate-prisma"
                className={sampleProject ? "cursor-not-allowed" : ""}
              >
                Generate Prisma
              </label>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-zinc-400 text-sm mb-2">Port</p>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="Enter port number"
              className={`w-full bg-zinc-900 rounded px-3 py-2 border border-zinc-800 text-white ${sampleProject ? "opacity-50" : ""}`}
              {...disabledWhenSample}
            />
          </div>

          <div className="mb-6 relative">
            <p className="text-zinc-400 text-sm mb-2">Framework Preset</p>
            <div
              className={`flex items-center bg-zinc-900 rounded px-3 py-2 border border-zinc-800 ${sampleProject ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() =>
                !sampleProject && setShowFrameworkOptions(!showFrameworkOptions)
              }
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                className="mr-2 text-zinc-400"
              ></svg>
              <span>
                {selectedFramework === "next" && "Next.js"}
                {selectedFramework === "vite" && "Vite"}
                {selectedFramework === "node" && "Node.js"}
              </span>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                className="ml-auto text-zinc-400"
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>

            {showFrameworkOptions && !sampleProject && (
              <div className="absolute left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded shadow-lg z-10">
                <div
                  className="px-3 py-2 hover:bg-zinc-800 cursor-pointer"
                  onClick={() => selectFramework("next")}
                >
                  Next.js
                </div>
                <div
                  className="px-3 py-2 hover:bg-zinc-800 cursor-pointer"
                  onClick={() => selectFramework("vite")}
                >
                  Vite
                </div>
                <div
                  className="px-3 py-2 hover:bg-zinc-800 cursor-pointer"
                  onClick={() => selectFramework("node")}
                >
                  Node.js
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-zinc-400 text-sm mb-2">
              Build and Output Settings
            </p>
            <div className="flex flex-col mb-3 gap-6">
              <div>
                <label className="text-xs text-zinc-400/50">
                  Build command
                </label>
                <input
                  type="text"
                  placeholder={`${selectedFramework === "node" ? "Default" : "npm run build"}`}
                  onChange={(e) => setBuildCommand(e.target.value)}
                  className={`w-full bg-zinc-800/20 rounded px-3 py-2 border border-zinc-700 text-white ${sampleProject ? "opacity-50" : ""}`}
                  {...disabledWhenSample}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400/50">Entry point</label>
                <input
                  type="text"
                  placeholder={`${selectedFramework === "node" ? "src/index.js" : "Default"}`}
                  onChange={(e) => setRootDirectory(e.target.value)}
                  className={`w-full bg-zinc-800/20 rounded px-3 py-2 border border-zinc-700 text-white ${sampleProject ? "opacity-50" : ""}`}
                  {...disabledWhenSample}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400/50">
                  Install command
                </label>
                <input
                  type="text"
                  placeholder="npm install"
                  onChange={(e) => setInstallDep(e.target.value)}
                  className={`w-full bg-zinc-800/20 rounded px-3 py-2 border border-zinc-700 text-white ${sampleProject ? "opacity-50" : ""}`}
                  {...disabledWhenSample}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-zinc-400 text-sm mb-2">Environment Variables</p>
            <div
              className={`bg-zinc-900 rounded border border-zinc-800 p-4 ${sampleProject ? "opacity-50" : ""}`}
            >
              {envVars.map((env, index) => (
                <div key={index} className="flex mb-3">
                  <input
                    type="text"
                    placeholder="Key"
                    value={env.key}
                    onChange={(e) =>
                      handleEnvChange(index, "key", e.target.value)
                    }
                    className="w-1/2 bg-zinc-800 rounded-l px-3 py-2 border border-zinc-700 text-white"
                    {...disabledWhenSample}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={env.value}
                    onChange={(e) =>
                      handleEnvChange(index, "value", e.target.value)
                    }
                    className="w-1/2 bg-zinc-800 rounded-r px-3 py-2 border border-zinc-700 border-l-0 text-white"
                    {...disabledWhenSample}
                  />
                </div>
              ))}
              <div className="flex w-full justify-between items-center">
                <button
                  onClick={addMoreEnvVars}
                  className={`bg-zinc-800 text-zinc-300 rounded px-3 py-1 text-sm border border-zinc-700 ${sampleProject ? "opacity-50 cursor-not-allowed" : ""}`}
                  {...disabledWhenSample}
                >
                  + Add More
                </button>
                <button
                  onClick={removeLastEnvVars}
                  className={`bg-zinc-800 text-zinc-300 rounded px-3 py-1 text-sm border border-zinc-700 ${sampleProject ? "opacity-50 cursor-not-allowed" : ""}`}
                  {...disabledWhenSample}
                >
                  - Remove
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <>
              <button
                disabled
                className="w-full bg-zinc-200 text-zinc-900 rounded py-3 font-medium flex items-center justify-center"
              >
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deployment Queued
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDeployment}
                className="w-full bg-zinc-100 text-zinc-900 rounded py-3 font-medium hover:cursor-pointer"
              >
                {deployed
                  ? "Re-deploy"
                  : `${deploymentIp(projectId) ? "Re-deploy" : "Deploy"}`}
              </button>
            </>
          )}
          <WsClient
            projectId={projectId}
            olderLogs={olderLogs}
            ip={ip}
            domain={domain}
            loading={loading}
          />
        </div>
      </div>
      {error && <Error message={error} clearError={clearError} />}
    </>
  );
};

export default Input;
