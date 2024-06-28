/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding");
        return config;
      },
      env: {
        CLOUD_WALLET_KEY: process.env.CLOUD_WALLET_KEY,
      }
};
export default nextConfig;
