/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['images.pexels.com', 'images.unsplash.com', 'unsplash.com'],
  },
  webpack: (config) => {
    // Prevent Next.js from scanning the old nested project
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**', '**/peacock-main/**'],
    };
    return config;
  },
};

module.exports = nextConfig;
