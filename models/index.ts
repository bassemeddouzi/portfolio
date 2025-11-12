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
  // Get the current sequelize instance (may have been recreated at runtime)
  // Re-import to get the latest instance
  const currentSequelize = require('@/lib/database').default
  
  // Check if we have a real connection (not a dummy from build time)
  const hasRealConfig = process.env.DB_HOST && process.env.DB_NAME && 
                        process.env.DB_USER && process.env.DB_PASSWORD
  
  // Check if we need to re-initialize models
  // This happens if:
  // 1. Models haven't been initialized yet
  // 2. We now have real config but models were initialized with dummy
  const wasDummy = modelsSequelize && (!process.env.DB_HOST || !process.env.DB_NAME)
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

