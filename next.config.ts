import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Temporary: Ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
