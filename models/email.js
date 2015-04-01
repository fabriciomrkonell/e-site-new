module.exports = function(sequelize, DataTypes) {
  var Email = sequelize.define('Email', {
    configuration: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    host: {
      type: DataTypes.STRING,
      allowNull: false
    },
    port: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  })
  return Email;
};