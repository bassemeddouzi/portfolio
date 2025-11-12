import { DataTypes, Model, Sequelize } from 'sequelize'

interface SkillAttributes {
  id?: number
  name: string
  level: number
  category: 'Frontend' | 'Backend' | 'Outils & Technologies'
  icon?: string
  order?: number
}

class Skill extends Model<SkillAttributes> implements SkillAttributes {
  public id!: number
  public name!: string
  public level!: number
  public category!: 'Frontend' | 'Backend' | 'Outils & Technologies'
  public icon?: string
  public order?: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export default function (sequelize: Sequelize) {
  Skill.init(
    {
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
        validate: {
          min: 0,
          max: 100,
        },
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
    },
    {
      sequelize,
      tableName: 'skills',
      timestamps: true,
    }
  )

  return Skill
}

