/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

const nextConfig = {
  reactStrictMode: true,
  // 'standalone' is for Docker/Hostinger — not needed on Vercel
  ...(process.env.BUILD_STANDALONE === 'true' && { output: 'standalone' }),
  experimental: {
    serverComponentsExternalPackages: ['pdfkit', 'fontkit'],
    serverActions: { bodySizeLimit: '4mb' },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdnjs.cloudflare.com' },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
