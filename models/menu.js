module.exports = function(sequelize, DataTypes) {
  var Menu = sequelize.define('Menu', {
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      unique: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })
  return Menu;
};