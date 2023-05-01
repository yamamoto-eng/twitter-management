/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
    ],
  },
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
  },
};

module.exports = nextConfig;
