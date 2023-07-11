/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: { serverActions: true },
    reactStrictMode: false,
    images: {
        domains: ['prodlslayerswapbridgesa.blob.core.windows.net', 'devlslayerswapbridgesa.blob.core.windows.net'],
    },
}

module.exports = nextConfig
