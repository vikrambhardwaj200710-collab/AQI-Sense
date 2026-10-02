/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow external SVG / images if needed
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
