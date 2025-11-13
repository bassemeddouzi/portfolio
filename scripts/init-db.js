/**
 * Script pour initialiser la base de données
 * Exécutez ce script après avoir configuré votre base de données PostgreSQL
 * node scripts/init-db.js
 * 
 * OU visitez simplement : http://localhost:3000/api/init
 */

require('dotenv').config({ path: '.env.local' })
require('dotenv').config()

const { Sequelize, DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')

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

async function initDatabase() {
  try {
    await sequelize.authenticate()
    console.log('✅ Connexion à la base de données réussie.')

    // Définir tous les modèles
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'admin',
      },
    }, {
      tableName: 'users',
      timestamps: true,
    })

    const About = sequelize.define('About', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jobTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageData: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
      },
      imageMimeType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stats: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    }, {
      tableName: 'abouts',
      timestamps: true,
    })

    const Skill = sequelize.define('Skill', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 100 },
      },
      category: {
        type: DataTypes.ENUM('Frontend', 'Backend', 'Outils & Technologies'),
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    }, {
      tableName: 'skills',
      timestamps: true,
    })

    const Experience = sequelize.define('Experience', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      period: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    }, {
      tableName: 'experiences',
      timestamps: true,
    })

    const Project = sequelize.define('Project', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      technologies: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      githubUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      demoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    }, {
      tableName: 'projects',
      timestamps: true,
    })

    // Synchroniser tous les modèles avec la base de données
    console.log('🔄 Synchronisation des modèles...')
    await sequelize.sync({ alter: true })
    console.log('✅ Tables créées : users, abouts, skills, experiences, projects')

    // Créer l'utilisateur admin par défaut
    const adminExists = await User.findOne({
      where: { email: 'admin@example.com' },
    })

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await User.create({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Administrateur',
        role: 'admin',
      })
      console.log('✅ Utilisateur admin créé:')
      console.log('   📧 Email: admin@example.com')
      console.log('   🔑 Password: admin123')
    } else {
      console.log('ℹ️  Utilisateur admin existe déjà.')
    }

    console.log('\n🎉 Initialisation terminée avec succès!')
    console.log('\n📝 Prochaines étapes :')
    console.log('   1. Visitez http://localhost:3000')
    console.log('   2. Connectez-vous au dashboard : http://localhost:3000/admin/login')
    console.log('   3. Ajoutez du contenu via le dashboard admin\n')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message)
    if (error.parent) {
      console.error('   Détails:', error.parent.message)
    }
    console.log('\n💡 Vérifiez :')
    console.log('   - Que PostgreSQL est démarré')
    console.log('   - Que le fichier .env contient les bonnes informations')
    console.log('   - Que la base de données portfolio_db existe')
    process.exit(1)
  }
}

initDatabase()

