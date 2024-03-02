/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "192.168.32.68:3003",
        "192.168.0.130:3003",
        "192.168.29.53:3006",
        "danhthiep.ntt.edu.vn",
      ],
    },
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // images: {
  //   formats: ["image/avif", "image/webp"],
  //   remotePatterns: [
  //     {
  //       protocol: "http",
  //       hostname: "localhost",
  //       port: "3001",
  //       pathname: "/avatar/**",
  //     },
  //   ],
  // },
  // experimental: {
  //   appDir: true,
  // },
  // output: "standalone",
  // output: "export",
  swcMinify: true,
};

module.exports = nextConfig;
