import { DataTypes, Model, Sequelize } from 'sequelize'

interface SettingsAttributes {
  id?: number
  key: string
  value: string
  description?: string
}

class Settings extends Model<SettingsAttributes> implements SettingsAttributes {
  public id!: number
  public key!: string
  public value!: string
  public description?: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export default function (sequelize: Sequelize) {
  Settings.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'settings',
      timestamps: true,
    }
  )

  return Settings
}

