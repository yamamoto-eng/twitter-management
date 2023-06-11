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
};

module.exports = nextConfig;
