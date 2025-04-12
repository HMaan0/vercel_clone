"use server";
import prisma from "@repo/db/src/client";

interface project {
  id: string;
  ip: string | null;
  logs: string[];
  port: string | null;
  repo: string | null;
  lib: "node" | "next" | "vite";
  prisma: boolean | null;
  workingDir: string | null;
  userId: string;
  instanceId: string | null;
  State: "processing" | "deployed";
}
export async function addNewProject(username: string) {
  const existingUser = await prisma.user.findUnique({
    where: { github: username },
  });

  if (existingUser) {
    const createNewProject = await prisma.project.create({
      data: {
        userId: existingUser.id,
        lib: "next",
        State: "processing",
      },
    });
    const newProject = [
      {
        id: createNewProject.id,
        lib: createNewProject.lib,
        State: createNewProject.State,
      },
    ];
    return newProject;
  } else {
    const createNewProject = await prisma.user.create({
      data: {
        github: username,
        projects: {
          create: {
            lib: "next",

            State: "processing",
          },
        },
      },
      include: {
        projects: true,
      },
    });
    const newProject = createNewProject.projects.map((project: project) => {
      const projectInfo = {
        id: project.id,
        lib: project.lib,
        State: project.State,
      };
      return projectInfo;
    });
    return newProject;
  }
}
