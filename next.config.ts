import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the Z.ai preview iframe host to drive the dev server so that
  // client-side navigation (next/link clicks, router.push, RSC fetches) works
  // when the app is embedded inside the preview-chat-*.space-z.ai sandbox.
  // Without this, Next.js rejects cross-origin /_next/* requests from the
  // preview and silently breaks <Link> navigation in the iframe.
  allowedDevOrigins: [
    "*.space-z.ai",
    "preview-chat-*.space-z.ai",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
