/** @type {import('next').NextConfig} */

const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/chat',
                permanent: true,
            },
            {
                source: '/admin',
                destination: '/admin/feedback',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;