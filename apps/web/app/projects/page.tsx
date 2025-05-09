"use client";
import Link from "next/link";
import { FaCodeBranch, FaGithub, FaPlus } from "react-icons/fa";
import { getProjects } from "../../lib/actions/getProjects";
import { TriangleIcon } from "../../components/icons/TriangleIcon";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { addNewProject } from "../../lib/actions/addNewProject";
import { PiDotsThreeCircle } from "react-icons/pi";
import { queuePushRemove } from "../../lib/actions/queuePush";
import LoadingSpinner from "../../components/LoadingSpinner";

type DomainEntry = {
  ip: string;
  domain: string | null;
  lastUsed: string | null;
};

type Project = {
  id: string;
  userId?: string;
  ip?: string | null;
  instanceId?: string | null;
  repo?: string | null;
  lib: string;
  prisma?: boolean | null;
  workingDir?: string | null;
  port?: string | null;
  logs?: string[];
  State: string;
  domain?: DomainEntry | null;
};

export default function Page() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[] | []>([]);
  const [addingProject, setAddingProject] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showPopup, setShowPopup] = useState<string | null>(null);

  useEffect(() => {
    async function main() {
      setLoadingProjects(true);
      try {
        if (session?.user.username) {
          const res = await getProjects(session.user.username);
          if (res) {
            setProjects(res);
          }
        } else {
          const res = await getProjects("1");
          if (res) {
            setProjects(res);
          }
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    }
    main();
  }, [session]);

  async function addProject() {
    setAddingProject(true);
    try {
      if (session?.user.username) {
        const res = await addNewProject(session.user.username);
        if (res) {
          setProjects((prev) => [...prev, ...res]);
        }
      } else {
        const res = await addNewProject("1");
        if (res) {
          setProjects((prev) => [...prev, ...res]);
        }
      }
    } catch (error) {
      console.error("Failed to add project:", error);
    } finally {
      setAddingProject(false);
    }
  }

  const handleDelete = async (projectId: string) => {
    await queuePushRemove(projectId);
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
    setShowPopup(null);
  };

  const togglePopup = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPopup(showPopup === projectId ? null : projectId);
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 py-6 2xl:px-40 xl:px-20 px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {loadingProjects
            ? Array(6)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`loader-${index}`}
                    className="bg-gray-600/10 animate-pulse rounded-lg shadow-md border border-gray-600/50 p-5 flex justify-center items-center h-48"
                  ></div>
                ))
            : projects.map((project: Project, i: number) => (
                <div key={i} className="relative">
                  <Link href={`/projects/${project.id}`}>
                    <div className="bg-gray-600/10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-600/50">
                      <div className="p-5">
                        {project.domain?.domain ? (
                          <>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-600/10">
                                <TriangleIcon className="h-5 w-5" />
                              </div>

                              <div className="flex-1">
                                <h3 className="font-semibold text-white">
                                  <p className="flex gap-2 items-center">
                                    {project.domain.domain}{" "}
                                    <span className="relative flex size-2">
                                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-25"></span>
                                      <span className="relative inline-flex size-2 rounded-full bg-sky-500"></span>
                                    </span>
                                  </p>
                                </h3>
                                <p className="text-xs 2xl:text-sm text-gray-400">
                                  {project.repo}
                                </p>
                              </div>
                              <button
                                onClick={(e) => togglePopup(e, project.id)}
                              >
                                <PiDotsThreeCircle
                                  size={30}
                                  className="text-gray-600 hover:text-gray-500 cursor-pointer"
                                />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 mb-4 px-2 py-1.5 bg-gray-700/50 rounded-md w-fit">
                              <FaGithub className="h-4 w-4 text-gray-400" />
                              <span className="text-xs 2xl:text-sm font-medium text-gray-300">
                                {project.repo}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-600/10">
                                <TriangleIcon className="h-5 w-5" />
                              </div>

                              <div className="flex w-full justify-between items-center">
                                <h3 className="font-semibold text-white">
                                  Click here for new deployment
                                </h3>
                                <button
                                  onClick={(e) => togglePopup(e, project.id)}
                                >
                                  <PiDotsThreeCircle
                                    size={30}
                                    className="text-gray-600 hover:text-gray-500 cursor-pointer"
                                  />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-4 px-2 py-1.5 bg-gray-700/50 rounded-md w-fit">
                              <FaGithub className="h-4 w-4 text-gray-400" />
                              <span className="text-xs 2xl:text-sm font-medium text-gray-300">
                                Import from your github repositories
                              </span>
                            </div>
                          </>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <FaCodeBranch className="h-3.5 w-3.5" />
                              <code className="bg-gray-700 px-1.5 py-0.5 rounded">
                                {project.State === "processing"
                                  ? "ready for deployment"
                                  : project.State}
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {showPopup === project.id && (
                    <div className="cursor-pointer absolute right-4 top-16 z-10 bg-red-600 hover:bg-red-800 border border-gray-700 rounded-2xl">
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-sm font-medium px-4 py-2 w-full text-left cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
          {!loadingProjects && (
            <button
              disabled={addingProject}
              onClick={addProject}
              className="bg-gray-600/10 border-gray-600/50 border border-dashed rounded-md h-full cursor-pointer hover:bg-gray-600/40 transition-colors duration-200"
            >
              <div className="px-8 py-4 h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-10 rounded-full bg-gray-600/40 flex items-center justify-center mb-3">
                  {addingProject ? (
                    <LoadingSpinner />
                  ) : (
                    <FaPlus className="text-gray-400" size={20} />
                  )}
                </div>
                {addingProject ? (
                  <>
                    <div className="font-medium text-gray-300">
                      Adding New Project
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      creating a new Deployment
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-medium text-gray-300">
                      Add New Project
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      create a new Deployment
                    </div>
                  </>
                )}
              </div>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
