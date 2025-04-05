export function git(
  repoLink: string,
  envs: string[],
  library: string,
  prismaClient: boolean,
  port: string,
  entryPoint?: string
) {
  console.log(repoLink);
  const rootDir = repoLink
    .split("/")
    .pop()
    ?.replace(/\.git$/, "");
  console.log(rootDir);
  //TODO: multiple ENVs & no ENV & use RUN npm install --legacy-peer-deps for your vite
  const dockerfile = `FROM node:20.12.0-alpine3.19
    
    WORKDIR /src
    
    COPY . .
    
    RUN npm install

    ${library !== "node" ? `RUN npm run build` : ``}

    ${prismaClient ? `RUN npx prisma generate` : ``}
    

    ${library === "node" ? `CMD ["node", "${entryPoint}"]` : ""}

    ${library === "next" ? `CMD ["npm", "run", "start"]` : ""}
    
    ${library === "vite" ? `CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "${port}"]` : ""}
    `;

  const parseDockerfile = dockerfile.replace(/(["`\\$])/g, "\\$1");
  const buildArg = envs.length > 0 ? envs.join(" --build-arg ") : "";
  const env = envs.length > 0 ? envs.join(" -e ") : "";
  const commands = [
    `git clone ${repoLink}`,
    `cd ${rootDir} && rm dockerfile`,
    `cd ${rootDir} && printf "${parseDockerfile}" > dockerfile`,
    `cd ${rootDir} && docker build ${envs.length > 0 ? `--build-arg ${buildArg} ` : ``} -t app .`,
    `cd ${rootDir} && docker run -d -p 3000:${port} ${envs.length > 0 ? `-e ${env}` : ``}  -t app `,
  ];
  return commands;
}
