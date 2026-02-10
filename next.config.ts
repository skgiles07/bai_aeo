import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://mellow-blessing-production-df7c.up.railway.app/api/:path*",
      },
      {
        source: "/health",
        destination:
          "https://mellow-blessing-production-df7c.up.railway.app/health",
      },
    ];
  },
};

export default nextConfig;
