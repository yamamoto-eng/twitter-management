/** @type {import('next').NextConfig} */

const intercept = require("intercept-stdout");

function interceptStdout(text) {
  if (text.includes("Duplicate atom key")) {
    return "";
  }
  return text;
}

intercept(interceptStdout);

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.twimg.com",
      },
    ],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    CALLBACK_URL: process.env.CALLBACK_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_PASSWORD_1: process.env.COOKIE_PASSWORD_1,
    COOKIE_PASSWORD_2: process.env.COOKIE_PASSWORD_2,
    COOKIE_NAME: process.env.COOKIE_NAME,
    APP_AWS_ACCESS_KEY_ID: process.env.APP_AWS_ACCESS_KEY_ID,
    APP_AWS_SECRET_ACCESS_KEY: process.env.APP_AWS_SECRET_ACCESS_KEY,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  },
};

module.exports = nextConfig;
