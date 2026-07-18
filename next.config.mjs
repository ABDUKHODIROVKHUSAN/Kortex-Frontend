/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
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
