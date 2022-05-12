/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/management/spaceships',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
