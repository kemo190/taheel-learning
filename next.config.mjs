/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'xglommazhpklgitxglti.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'new-eyouth-learning-website.s3.us-east-2.amazonaws.com',
      }
    ],
  },
};

export default nextConfig;
