module.exports = function(sequelize, DataTypes) {
  var Sale = sequelize.define('Sale', {
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.INTEGER,
    },
    finishDate: {
      type: DataTypes.INTEGER,
    },
    products: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: function(models) {
        Sale.hasMany(models.Product)
        Sale.hasMany(models.Association, { onDelete: 'cascade' });
      }
    }
  })
  return Sale;
};