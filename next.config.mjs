/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // Enable loading local images via next/image
      // You don't need to specify domains for local files
      // You only need this if loading from external URLs:
      // domains: ['example.com']
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      });
      return config;
    },
  };
  
  export default nextConfig;
    