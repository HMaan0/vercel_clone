import Link from "next/link";
import { FaCodeBranch, FaGithub, FaPlus } from "react-icons/fa";
import { getProjects } from "../../lib/actions/getProjects";
import { TriangleIcon } from "../../components/icons/TriangleIcon";
type Project = {
  id: string;
  userId: string;
  ip: string | null;
  instanceId: string | null;
  repo: string | null;
  lib: string;
  prisma: boolean | null;
  workingDir: string | null;
  port: string | null;
  logs: string[];
  State: string;
};
export default async function page() {
  const projects = await getProjects("1");
  return (
    <div className="flex flex-col">
      <main className="flex-1 py-6  2xl:px-40 xl:px-20 px-10 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project: Project, i: number) => (
            <Link key={i} href={`/projects/${project.id}`}>
              <div className=" bg-gray-600/10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-600/50">
                <div className="p-5">
                  {project.ip ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-600/10">
                          <TriangleIcon className="h-5 w-5 " />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-white">
                            <p className="flex gap-2  items-center">
                              {project.ip}{" "}
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
                          <TriangleIcon className="h-5 w-5 " />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-white">
                            Click here for new deployment
                          </h3>
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
          ))}

          <div className="bg-gray-600/10 border-gray-600/50 border  border-dashed rounded-md h-full cursor-pointer hover:bg-gray-600/40 transition-colors duration-200">
            <div className="px-8 py-4 h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-10 rounded-full bg-gray-600/40 flex items-center justify-center mb-3">
                <FaPlus className="text-gray-400" size={20} />
              </div>
              <div className="font-medium text-gray-300">Add New Project</div>
              <div className="text-sm text-gray-500 mt-2">
                Import or create a new project
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
