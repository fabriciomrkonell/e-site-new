module.exports = function(sequelize, DataTypes) {
  var GroupPage = sequelize.define('GroupPage', {
  }, {
    classMethods: {
      associate: function(models) {
        GroupPage.belongsTo(models.Group);
        GroupPage.belongsTo(models.Page);
      }
    }
  })
  return GroupPage;
};