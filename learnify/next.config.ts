/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.remotePatterns","avatars.githubusercontent.com","lh3.googleusercontent.com","s3.us-west-2.amazonaws.com"], // Allow GitHub avatars
  },
};

module.exports = nextConfig;
