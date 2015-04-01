module.exports = function(sequelize, DataTypes) {
  var Association = sequelize.define('Association', {
  }, {
    classMethods: {
      associate: function(models) {
        Association.belongsTo(models.Product);
        Association.belongsTo(models.Sale);
      }
    }
  })
  return Association;
};