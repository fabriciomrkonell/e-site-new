module.exports = function(sequelize, DataTypes) {
  var Page = sequelize.define('Page', {
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    classMethods: {
      associate: function(models) {
        Page.hasMany(models.GroupPage, { onDelete: 'cascade' });
      }
    }
  })
  return Page;
};