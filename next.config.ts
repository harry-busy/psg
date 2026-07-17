import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Pollinations (free image gen) + common jewellery image CDNs.
    remotePatterns: [
      { protocol: "https", hostname: "image.pollinations.ai" },
      { protocol: "https", hostname: "gen.pollinations.ai" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
  },
  // @imgly/background-removal ships wasm/onnx assets; don't let webpack choke on them.
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
    return config;
  },
};

export default nextConfig;
