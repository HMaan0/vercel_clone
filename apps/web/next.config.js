/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/webhook",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://github.com,https://api.github.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-GitHub-Event, X-GitHub-Delivery, X-Hub-Signature, X-Hub-Signature-256, Content-Type",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
