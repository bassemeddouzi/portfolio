/**
 * Script pour tester la connexion à PostgreSQL
 * Exécutez : node scripts/test-db-connection.js
 */

require('dotenv').config({ path: '.env.local' })
require('dotenv').config()

const { Sequelize } = require('sequelize')

async function testConnection() {
  const sequelize = new Sequelize(
    process.env.DB_NAME || 'portfolio_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      dialect: 'postgres',
      logging: console.log,
    }
  )

  try {
    await sequelize.authenticate()
    console.log('✅ Connexion à PostgreSQL réussie !')
    console.log(`📊 Base de données : ${process.env.DB_NAME || 'portfolio_db'}`)
    console.log(`👤 Utilisateur : ${process.env.DB_USER || 'postgres'}`)
    console.log(`🌐 Hôte : ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur de connexion à PostgreSQL :')
    console.error(error.message)
    console.log('\n💡 Vérifiez :')
    console.log('  1. Que PostgreSQL est démarré')
    console.log('  2. Que le fichier .env contient les bonnes informations')
    console.log('  3. Que la base de données existe')
    process.exit(1)
  }
}

testConnection()

