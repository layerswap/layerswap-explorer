/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['prodlslayerswapbridgesa.blob.core.windows.net', 'devlslayerswapbridgesa.blob.core.windows.net'],
    },
}

module.exports = nextConfig
