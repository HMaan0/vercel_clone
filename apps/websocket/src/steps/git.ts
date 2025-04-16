export function git(
  repoLink: string,
  envs: string[],
  library: string,
  prismaClient: boolean,
  port: string,
  workingDir: string | null,
  buildCommand: string | null,
  installDep: string | null
) {
  const rootDir = repoLink
    .split("/")
    .pop()
    ?.replace(/\.git$/, "");
  const dockerfile = `FROM node:20.12.0-alpine3.19
    
    WORKDIR /src
    
    COPY . .
    
    ${installDep ? `RUN ${installDep}` : `RUN npm install`}

  ${library !== "node" ? `${buildCommand ? buildCommand : `RUN npm run build`}` : ``}

    ${prismaClient ? `RUN npx prisma generate` : ``}
    

    ${library === "node" ? `CMD ["node", "${workingDir}"]` : ""}

    ${library === "next" ? `CMD ["npm", "run", "start"]` : ""}
    
    ${library === "vite" ? `CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "${port}"]` : ""}
    `;

  const parseDockerfile = dockerfile.replace(/(["`\\$])/g, "\\$1");
  const buildArg = envs.length > 0 ? envs.join(" --build-arg ") : "";
  const env = envs.length > 0 ? envs.join(" -e ") : "";
  const commands = [
    `rm -rf ${rootDir}`,
    `docker stop $(docker ps -aq) && docker rm $(docker ps -aq) && docker rmi $(docker images -q)`,
    `docker system prune -a`,
    `git clone ${repoLink}`,
    `cd ${rootDir} && rm dockerfile`,
    `cd ${rootDir} && printf "${parseDockerfile}" > dockerfile`,
    `cd ${rootDir} && docker build ${envs.length > 0 ? `--build-arg ${buildArg} ` : ``} -t app .`,
    `cd ${rootDir} && docker run -d -p 3000:${port} ${envs.length > 0 ? `-e ${env}` : ``}  -t app `,
  ];
  return commands;
}
