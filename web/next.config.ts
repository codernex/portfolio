import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        hostname: "cdn.codernex.dev",
        protocol: "https",
      },
      {
        hostname: "ap-south-1.amazonaws.com",
        protocol: "https",
      },
      {
        hostname: "codernex.s3.ap-south-1.amazonaws.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
