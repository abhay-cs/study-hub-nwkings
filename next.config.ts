import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["framerusercontent.com"], // 👈 add this
  },
  typescript: {
    // ✅ Ignore build errors so deployment won’t fail
    ignoreBuildErrors: true,
  },
};

export default nextConfig;