export async function git(
  repoLink: string,
  env: string[],
  library: string,
  entryPoint: string,
  prismaClient: boolean,
  port: string
) {
  const rootDir = repoLink
    .split("/")
    .pop()
    ?.replace(/\.git$/, "");
  //TODO: multiple ENVs & no ENV
  if (library === "node") {
    const dockerfile = `FROM node:20.12.0-alpine3.19
    
    WORKDIR /src
    
    COPY . .
    
    RUN npm install
    
    ${prismaClient ? `RUN npx prisma generate` : ``}
    
    CMD ["node", "${entryPoint}"]`;

    const parseDockerfile = dockerfile.replace(/(["`\\$])/g, "\\$1");
    const commands = [
      `git clone ${repoLink}`,
      `cd ${rootDir} && rm dockerfile`,
      `cd ${rootDir} && printf "${parseDockerfile}" > dockerfile`,
      `cd ${rootDir} && docker build --build-arg ${env} -t app .`,
      `cd ${rootDir} && docker run -p 3000:${port} -e ${env} -t app `,
    ];
    return commands;
  }
  return [];
}
