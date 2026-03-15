/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // 适配 Cloudflare Pages
  trailingSlash: true,
};

module.exports = nextConfig;
