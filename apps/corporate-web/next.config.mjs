/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@wellness/ui', '@wellness/types', '@wellness/utils'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default nextConfig;
