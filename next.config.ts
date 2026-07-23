import type { NextConfig } from "next";

/**
 * Build Next.js `images.remotePatterns` from NEXT_PUBLIC_API_BASE_URL so
 * stage / production / local hosts are never hardcoded in source.
 */
function remotePatternsFromApiBaseUrl(apiBaseUrl: string | undefined) {
  if (!apiBaseUrl) return [];

  try {
    const url = new URL(apiBaseUrl);
    const protocol = url.protocol.replace(":", "") as "http" | "https";
    const basePath = url.pathname.replace(/\/$/, "") || "";

    return [
      {
        protocol,
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: `${basePath}/files/**` as const,
      },
    ];
  } catch {
    console.warn(
      `[next.config] Invalid NEXT_PUBLIC_API_BASE_URL: "${apiBaseUrl}". Skipping image remotePatterns.`,
    );
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: remotePatternsFromApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL),
  },
};

export default nextConfig;
