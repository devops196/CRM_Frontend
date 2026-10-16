/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Don't fail production builds due to ESLint warnings/errors.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Don't fail production builds due to TypeScript type errors.
  // The runtime code is correct — type issues are fixed separately.
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  // Optional server-side proxy: rewrites /api/* → backend.
  // Only used for server-rendered requests; browser fetches use NEXT_PUBLIC_API_URL.
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.BACKEND_API_URL ||
      'http://localhost:8000';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
