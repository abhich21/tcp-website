import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this 'images' property
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
