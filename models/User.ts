import { DataTypes, Model, Sequelize } from 'sequelize'

interface UserAttributes {
  id?: number
  email: string
  password: string
  name?: string
  role?: 'admin' | 'user'
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number
  public email!: string
  public password!: string
  public name?: string
  public role?: 'admin' | 'user'

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export default function (sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'admin',
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
    }
  )

  return User
}

