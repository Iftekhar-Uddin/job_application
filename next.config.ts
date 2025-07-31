import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        // port: "",
        // pathname: "/images/**",
      },
    ],
    // You can add other options here, like deviceSizes, imageSizes, etc.
  },
};

export default nextConfig;