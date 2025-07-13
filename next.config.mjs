/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint errors during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize images during build
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  // Ignore specific files or patterns during builds
  webpack(config) {
    // Ignore specific files from being processed
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/.git/**',
        '**/node_modules/**',
        '**/.next/**',
        '**/docs/**',
        '**/tests/**',
        '**/*.test.*',
        '**/*.spec.*',
      ],
    };
    return config;
  },
}

export default nextConfig
