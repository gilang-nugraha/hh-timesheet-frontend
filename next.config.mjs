/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "timesheet-demo.gilanglie.com",
      },
    ],
  },
};

export default nextConfig;
