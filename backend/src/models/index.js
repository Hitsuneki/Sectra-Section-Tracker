const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false,
});

// Import models
const User = require('./user')(sequelize);
const Section = require('./section')(sequelize);
const Student = require('./student')(sequelize);
const Task = require('./task')(sequelize);
const Progress = require('./progress')(sequelize);

// Define relations
User.hasMany(Section, { foreignKey: 'userId', onDelete: 'CASCADE' });
Section.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Progress, { foreignKey: 'userId', onDelete: 'CASCADE' });
Progress.belongsTo(User, { foreignKey: 'userId' });

Section.hasMany(Student, { foreignKey: 'sectionId', onDelete: 'CASCADE' });
Student.belongsTo(Section, { foreignKey: 'sectionId' });

Section.hasMany(Task, { foreignKey: 'sectionId', onDelete: 'CASCADE' });
Task.belongsTo(Section, { foreignKey: 'sectionId' });

Student.hasMany(Progress, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Progress.belongsTo(Student, { foreignKey: 'studentId' });

Task.hasMany(Progress, { foreignKey: 'taskId', onDelete: 'CASCADE' });
Progress.belongsTo(Task, { foreignKey: 'taskId' });

module.exports = {
  sequelize,
  User,
  Section,
  Student,
  Task,
  Progress,
};
