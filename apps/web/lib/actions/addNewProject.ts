"use server";
import prisma from "@repo/db/src/client";

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
    const newProject = createNewProject.projects.map((project) => {
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
