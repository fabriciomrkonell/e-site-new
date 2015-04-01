module.exports = function(sequelize, DataTypes) {
  var Feature = sequelize.define('Feature', {
    feature: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Feature.belongsTo(models.Product);
      }
    }
  })
  return Feature;
};