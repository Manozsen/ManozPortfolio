/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Prevents ESLint from failing the production build.
    // Lint errors are still visible in dev and CI logs.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
