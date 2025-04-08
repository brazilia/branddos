import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // <--- disables ESLint blocking the build
  },
};

export default nextConfig;
