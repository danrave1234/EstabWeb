import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // Permanently redirect www → non-www for the main EstabWeb domain
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.estabweb.com" }],
        destination: "https://estabweb.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
