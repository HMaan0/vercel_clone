/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  devIndicators: {
    autoPrerender: false,
  },
  experimental: {
    allowMiddlewareResponseBody: true,
  },
  allowedDevOrigins: ["http://mouse.localhost:3000"], // 👈 ADD THIS
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
