import { DataTypes, Model, Sequelize } from 'sequelize'

interface AboutStats {
  projects?: number
  experience?: number
  clients?: number
  showProjects?: boolean
  showExperience?: boolean
  showClients?: boolean
}

interface AboutAttributes {
  id?: number
  name?: string
  jobTitle?: string
  title: string
  description: string
  imageUrl?: string | null
  imageData?: Buffer | null
  imageMimeType?: string | null
  stats?: AboutStats
}

class About extends Model<AboutAttributes> implements AboutAttributes {
  declare id: number
  declare name?: string
  declare jobTitle?: string
  declare title: string
  declare description: string
  declare imageUrl?: string | null
  declare imageData?: Buffer | null
  declare imageMimeType?: string | null
  declare stats?: AboutStats

  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

export default function (sequelize: Sequelize) {
  About.init(
    {
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
    },
    {
      sequelize,
      tableName: 'abouts',
      timestamps: true,
    }
  )

  return About
}

