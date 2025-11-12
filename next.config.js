/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclure Sequelize et les packages de base de données du bundling côté client
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    
    // Ignorer les warnings de dépendances critiques de Sequelize
    config.ignoreWarnings = [
      { module: /node_modules\/sequelize/ },
      { module: /node_modules\/pg/ },
    ]
    
    return config
  },
  // Configuration pour le warning cross-origin en développement
  experimental: {
    serverComponentsExternalPackages: ['sequelize', 'pg', 'pg-hstore'],
  },
}

module.exports = nextConfig

