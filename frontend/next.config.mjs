/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  env: {
    APP_URL: process.env.APP_URL,
    CLOUD_WALLET_KEY: process.env.CLOUD_WALLET_KEY,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    CONTRACT_ADDRESS_PROD: process.env.CONTRACT_ADDRESS_PR
  },
  reactStrictMode: false,
  images: {
    domains: ['ipfs.io'],
  },

};
export default nextConfig;
