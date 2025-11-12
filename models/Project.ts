import { DataTypes, Model, Sequelize } from 'sequelize'

interface ProjectAttributes {
  id?: number
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  demoUrl?: string
  imageUrl?: string
  order?: number
}

class Project extends Model<ProjectAttributes> implements ProjectAttributes {
  public id!: number
  public title!: string
  public description!: string
  public technologies!: string[]
  public githubUrl?: string
  public demoUrl?: string
  public imageUrl?: string
  public order?: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export default function (sequelize: Sequelize) {
  Project.init(
    {
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
    },
    {
      sequelize,
      tableName: 'projects',
      timestamps: true,
    }
  )

  return Project
}

