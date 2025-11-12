import sequelize from '@/lib/database'
import User from './User'
import About from './About'
import Skill from './Skill'
import Experience from './Experience'
import Project from './Project'
import Settings from './Settings'
import type { Sequelize } from 'sequelize'

let modelsInstance: any = null
let modelsSequelize: Sequelize | null = null

function getModels() {
  // Get the latest sequelize instance
  // During build, this will be a dummy instance; at runtime, it will be the real connection
  let currentSequelize: Sequelize
  
  // First, try to get sequelize from the imported module
  if (sequelize) {
    currentSequelize = sequelize
  } else {
    // Fallback: require it directly
    const dbModule = require('@/lib/database')
    currentSequelize = dbModule.default || (dbModule.getSequelize ? dbModule.getSequelize() : null)
  }
  
  // If still no instance, create a dummy one
  if (!currentSequelize) {
    const { Sequelize } = require('sequelize')
    currentSequelize = new Sequelize('dummy_db', 'dummy_user', 'dummy_pass', {
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
      logging: false,
    })
  }
  
  // Check if we have a real connection (not a dummy from build time)
  const hasRealConfig = process.env.DB_HOST && process.env.DB_NAME && 
                        process.env.DB_USER && process.env.DB_PASSWORD
  
  // If we had a dummy instance but now have real config, get fresh instance
  const wasDummy = modelsSequelize && (!process.env.DB_HOST || !process.env.DB_NAME)
  if (hasRealConfig && wasDummy) {
    // Get fresh instance with real config
    const dbModule = require('@/lib/database')
    const getSequelizeFn = dbModule.getSequelize
    const freshInstance = getSequelizeFn ? getSequelizeFn() : dbModule.default
    if (freshInstance) {
      currentSequelize = freshInstance
    }
  }
  
  // Check if we need to re-initialize models
  // This happens if:
  // 1. Models haven't been initialized yet
  // 2. We now have real config but models were initialized with dummy
  const needsReinit = !modelsInstance || (hasRealConfig && wasDummy)
  
  if (needsReinit) {
    // Initialize or re-initialize models with current sequelize instance
    modelsInstance = {
      User: User(currentSequelize),
      About: About(currentSequelize),
      Skill: Skill(currentSequelize),
      Experience: Experience(currentSequelize),
      Project: Project(currentSequelize),
      Settings: Settings(currentSequelize),
    }
    modelsSequelize = currentSequelize
  }
  
  return modelsInstance
}

// Initialize models at module load (may use dummy instance during build)
// At runtime, when models are accessed, they'll be re-initialized with real connection if needed
let models = getModels()

// Use a Proxy to ensure models are always up-to-date
// This allows models to be re-initialized at runtime if they were initialized with dummy during build
models = new Proxy(models, {
  get(target, prop) {
    // Always get fresh models to ensure we have the latest connection
    const freshModels = getModels()
    return freshModels[prop as string]
  }
})

export { sequelize }
export default models

