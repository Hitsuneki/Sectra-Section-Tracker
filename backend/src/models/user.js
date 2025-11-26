const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'users',
  });

  User.prototype.validatePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  User.beforeCreate(async (user, options) => {
    if(user.passwordHash) {
      const hash = await bcrypt.hash(user.passwordHash, 10);
      user.passwordHash = hash;
    }
  });

  User.beforeUpdate(async (user, options) => {
    if(user.changed('passwordHash')) {
      const hash = await bcrypt.hash(user.passwordHash, 10);
      user.passwordHash = hash;
    }
  });

  return User;
};
