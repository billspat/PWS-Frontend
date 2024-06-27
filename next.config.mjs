// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://ec2-18-207-156-10.compute-1.amazonaws.com/:path*",
      },
    ];
  },
};

export default nextConfig;
