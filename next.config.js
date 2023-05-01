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
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_PASSWORD_1: process.env.COOKIE_PASSWORD_1,
    COOKIE_PASSWORD_2: process.env.COOKIE_PASSWORD_2,
    COOKIE_NAME: process.env.COOKIE_NAME,
  },
};

module.exports = nextConfig;
