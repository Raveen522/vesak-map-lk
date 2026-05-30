import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow mobile testing on the local network IP
  // @ts-ignore
  allowedDevOrigins: ['192.168.8.112'],
};

export default nextConfig;
