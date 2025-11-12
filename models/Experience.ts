import { DataTypes, Model, Sequelize } from 'sequelize'

interface ExperienceAttributes {
  id?: number
  title: string
  company: string
  period: string
  description: string[]
  order?: number
}

class Experience extends Model<ExperienceAttributes> implements ExperienceAttributes {
  public id!: number
  public title!: string
  public company!: string
  public period!: string
  public description!: string[]
  public order?: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export default function (sequelize: Sequelize) {
  Experience.init(
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
    },
    {
      sequelize,
      tableName: 'experiences',
      timestamps: true,
    }
  )

  return Experience
}

