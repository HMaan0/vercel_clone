"use server";
import prisma from "@repo/db/src/client";

export async function getProjects(userId: string) {
  try {
    console.log(userId);
    const projectIds = await prisma.user.findFirst({
      where: { github: userId },
      select: {
        projects: true,
      },
    });
    console.log(projectIds);

    return projectIds?.projects;
  } catch (error) {
    throw new Error(`error fetching data ${error}`);
  }
}
export async function getProject(projectId: string) {
  try {
    const projectInfo = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        ip: true,
        instanceId: true,
        repo: true,
        lib: true,
        prisma: true,
        workingDir: true,
        port: true,
        logs: true,
        State: true,
      },
    });
    return projectInfo;
  } catch (error) {
    throw new Error(`error fetching data ${error}`);
  }
}
