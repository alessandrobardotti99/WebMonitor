/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true, // Se usi Server Actions
  },
};

module.exports = nextConfig;
