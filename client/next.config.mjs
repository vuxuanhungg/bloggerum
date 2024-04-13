/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'bloggerum.s3.tebi.io',
            },
        ],
    },
}

export default nextConfig
