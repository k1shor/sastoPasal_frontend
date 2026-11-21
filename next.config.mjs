/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Mock product images. Add the backend/CDN host here when the API is live.
    remotePatterns: [{ protocol: 'https', hostname: 'picsum.photos' }],
  },
};

export default nextConfig;
