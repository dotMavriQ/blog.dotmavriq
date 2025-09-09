/** @type {import('next').NextConfig} */
// Using a custom domain (CNAME) so no basePath is required. Static export is enabled.
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, path: false, process: false };
    }
    return config;
  },
  typescript: { ignoreBuildErrors: true }, // TODO: tighten later
};

module.exports = nextConfig;
