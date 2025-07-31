/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This will allow the build to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;