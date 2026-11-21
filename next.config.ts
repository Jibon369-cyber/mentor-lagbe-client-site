import type { NextConfig } from "next";

// API_URL is set in .env.local (and in the hosting dashboard in production).
// The fallback keeps local builds working even when the file is missing.
const apiUrl = (process.env.API_URL || "http://localhost:5000").replace(
  /\/+$/,
  "",
);

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
