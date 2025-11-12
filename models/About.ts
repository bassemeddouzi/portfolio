import { DataTypes, Model, Sequelize } from 'sequelize'

interface AboutAttributes {
  id?: number
  name?: string
  jobTitle?: string
  title: string
  description: string
  imageUrl?: string
  stats?: {
    projects?: number
    experience?: number
    clients?: number
    showProjects?: boolean
    showExperience?: boolean
    showClients?: boolean
  }
}

class About extends Model<AboutAttributes> implements AboutAttributes {
  public id!: number
  public name?: string
  public jobTitle?: string
  public title!: string
  public description!: string
  public imageUrl?: string
  public stats?: {
    projects?: number
    experience?: number
    clients?: number
    showProjects?: boolean
    showExperience?: boolean
    showClients?: boolean
  }

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
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

