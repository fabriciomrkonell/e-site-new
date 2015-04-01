module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Group.hasMany(models.User, { onDelete: 'cascade' });
      }
    }
  });
  return Group;
};