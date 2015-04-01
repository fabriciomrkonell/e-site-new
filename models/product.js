'use strict';

module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('Product', {
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    newValue: {
      type: DataTypes.STRING,
      allowNull: false
    },
    oldValue: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    picture1: {
      type: DataTypes.STRING,
      defaultValue: '/img/nopicture/product.png'
    },
    picture2: {
      type: DataTypes.STRING,
      defaultValue: '/img/nopicture/product.png'
    },
    picture3: {
      type: DataTypes.STRING,
      defaultValue: '/img/nopicture/product.png'
    },
    picture4: {
      type: DataTypes.STRING,
      defaultValue: '/img/nopicture/product.png'
    },
    picture5: {
      type: DataTypes.STRING,
      defaultValue: '/img/nopicture/product.png'
    },
    star: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  } , {
    classMethods: {
      associate: function(models) {
        Product.belongsTo(models.Department);
        Product.hasMany(models.Association, { onDelete: 'cascade' });
        Product.hasMany(models.Feature, { onDelete: 'cascade' });
      }
    }
  })
  return Product;
};