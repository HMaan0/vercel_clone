import axios from "axios";

export async function createWebhook(
  accessToken: string,
  owner: string,
  repo: string
) {
  const webhookUrl = `${process.env.NEXTAUTH_URL ?? "https://deployit.vercel.app"}/api/webhook`;
  try {
    const res = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/hooks`,
      {
        name: "web",
        active: true,
        events: ["push"],
        config: {
          url: webhookUrl,
          content_type: "json",
          secret: "webhook_secret",
          insecure_ssl: "0",
        },
      },
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
