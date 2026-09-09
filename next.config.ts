import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  allowedDevOrigins: ["172.20.10.11", "192.168.1.2", "http://172.20.10.11:3000"],
};

export default nextConfig;
