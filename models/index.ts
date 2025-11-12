import sequelize from '@/lib/database'
import User from './User'
import About from './About'
import Skill from './Skill'
import Experience from './Experience'
import Project from './Project'
import Settings from './Settings'

// Initialize models
const models = {
  User: User(sequelize),
  About: About(sequelize),
  Skill: Skill(sequelize),
  Experience: Experience(sequelize),
  Project: Project(sequelize),
  Settings: Settings(sequelize),
}

// Define associations if needed
// models.Project.belongsTo(models.User, { foreignKey: 'userId' })

export { sequelize }
export default models

