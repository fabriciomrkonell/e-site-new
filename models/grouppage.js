module.exports = function(sequelize, DataTypes) {
  var GroupPage = sequelize.define('GroupPage', {
  }, {
    classMethods: {
      associate: function(models) {
        Routes.belongsTo(models.Group);
        Routes.belongsTo(models.Page);
      }
    }
  })
  return GroupPage;
};