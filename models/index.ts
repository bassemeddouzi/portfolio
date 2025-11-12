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

function getSequelizeInstance(): Sequelize {
  // Always get a valid sequelize instance
  // During build, this will be a dummy instance; at runtime, it will be the real connection
  let instance: Sequelize | undefined | null = null
  
  // Try to get from imported sequelize first
  try {
    if (sequelize && typeof sequelize === 'object' && 'dialect' in sequelize) {
      instance = sequelize as Sequelize
    }
  } catch (e) {
    // Ignore errors
  }
  
  // If the imported sequelize is not valid, try to get it from the module
  if (!instance) {
    try {
      const dbModule = require('@/lib/database')
      instance = dbModule.default
      if (!instance && dbModule.getSequelize) {
        instance = dbModule.getSequelize()
      }
    } catch (e) {
      // Ignore errors
    }
  }
  
  // If still no instance, create a dummy one as last resort
  if (!instance) {
    const { Sequelize } = require('sequelize')
    instance = new Sequelize('dummy_db', 'dummy_user', 'dummy_pass', {
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
      logging: false,
    })
  }
  
  // Final validation - ensure it's a Sequelize instance
  if (!instance || typeof instance !== 'object' || !('dialect' in instance)) {
    const { Sequelize } = require('sequelize')
    instance = new Sequelize('dummy_db', 'dummy_user', 'dummy_pass', {
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
      logging: false,
    })
  }
  
  return instance as Sequelize
}

function getModels() {
  // Get a valid sequelize instance
  const currentSequelize = getSequelizeInstance()
  
  // Ensure we have a valid instance
  if (!currentSequelize) {
    throw new Error('Failed to get Sequelize instance')
  }
  
  // Check if we have a real connection (not a dummy from build time)
  const hasRealConfig = process.env.DB_HOST && process.env.DB_NAME && 
                        process.env.DB_USER && process.env.DB_PASSWORD
  
  // If we had a dummy instance but now have real config, get fresh instance
  const wasDummy = modelsSequelize && (!process.env.DB_HOST || !process.env.DB_NAME)
  let finalSequelize = currentSequelize
  
  if (hasRealConfig && wasDummy) {
    // Get fresh instance with real config
    const dbModule = require('@/lib/database')
    const getSequelizeFn = dbModule.getSequelize
    const freshInstance = getSequelizeFn ? getSequelizeFn() : dbModule.default
    if (freshInstance) {
      finalSequelize = freshInstance
    }
  }
  
  // Check if we need to re-initialize models
  // This happens if:
  // 1. Models haven't been initialized yet
  // 2. We now have real config but models were initialized with dummy
  const needsReinit = !modelsInstance || (hasRealConfig && wasDummy)
  
  if (needsReinit) {
    // Initialize or re-initialize models with current sequelize instance
    // Ensure the instance is valid before passing to models
    if (!finalSequelize) {
      finalSequelize = getSequelizeInstance()
    }
    
    modelsInstance = {
      User: User(finalSequelize),
      About: About(finalSequelize),
      Skill: Skill(finalSequelize),
      Experience: Experience(finalSequelize),
      Project: Project(finalSequelize),
      Settings: Settings(finalSequelize),
    }
    modelsSequelize = finalSequelize
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

