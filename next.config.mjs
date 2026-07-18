/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: do not set output:"standalone" here — that is for Docker only.
  // Vercel should use the default Next.js output (standalone can confuse deploys).
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = { type: "memory" };
    }
    // react-pdf / pdfjs optional canvas dependency
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
