"use server";
import { Octokit } from "@octokit/rest";

export async function getRepos(accessToken: string, username?: string) {
  //   if (!github_id || github_id == -1) return [];
  if (!accessToken) return [];

  const octokit = new Octokit({ auth: accessToken });

  try {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      visibility: "all",
      sort: "updated",
      per_page: 100,
    });

    const repos = data.map((repo) => ({
      name: repo.name,
      private: repo.private,
      owner: repo.owner.login.toLowerCase(),
    }));

    if (username) {
      const filteredRepos = repos.filter((repo) =>
        repo.owner.includes(username.toLowerCase())
      );
      return filteredRepos;
    }
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
}
