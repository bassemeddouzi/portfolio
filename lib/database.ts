import { Sequelize } from 'sequelize'

let sequelizeInstance: Sequelize | null = null
let isDummy = false

function getSequelize(): Sequelize {
  // Check if we have database configuration
  const hasDbConfig = process.env.DB_HOST && process.env.DB_NAME && 
                      process.env.DB_USER && process.env.DB_PASSWORD

  // If we have a dummy instance but now have real config, recreate
  if (isDummy && hasDbConfig) {
    // Close dummy instance
    if (sequelizeInstance) {
      sequelizeInstance.close().catch(() => {})
    }
    sequelizeInstance = null
    isDummy = false
  }

  // Create instance if it doesn't exist
  if (!sequelizeInstance) {
    if (!hasDbConfig) {
      // During build time, environment variables may not be available
      // Create a dummy instance to allow the module to load without errors
      sequelizeInstance = new Sequelize('', '', '', {
        dialect: 'postgres',
        logging: false,
      })
      isDummy = true
    } else {
      // We have database config - validate and create real connection
      const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST']
      const missingEnvVars = requiredEnvVars.filter(
        (varName) => !process.env[varName]
      )

      if (missingEnvVars.length > 0) {
        throw new Error(
          `Missing required environment variables: ${missingEnvVars.join(', ')}`
        )
      }

      // Create the actual database connection
      sequelizeInstance = new Sequelize(
        process.env.DB_NAME!,
        process.env.DB_USER!,
        process.env.DB_PASSWORD!,
        {
          host: process.env.DB_HOST!,
          port: parseInt(process.env.DB_PORT || '5432'),
          dialect: 'postgres',
          logging: process.env.NODE_ENV === 'development' ? console.log : false,
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
          // SSL configuration for production (e.g., Vercel Postgres, AWS RDS)
          dialectOptions: process.env.DB_SSL === 'true' ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          } : {},
        }
      )
      isDummy = false
    }
  }

  return sequelizeInstance
}

// Initialize at module load (may be dummy during build)
let sequelize = getSequelize()

// Use a Proxy to ensure we always get the current connection
// This allows the connection to be recreated at runtime if it was a dummy during build
sequelize = new Proxy(sequelize, {
  get(target, prop) {
    // Always get fresh connection to ensure we have real connection at runtime
    const currentSequelize = getSequelize()
    return (currentSequelize as any)[prop]
  }
}) as Sequelize

export default sequelize

