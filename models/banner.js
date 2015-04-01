'use strict';

module.exports = function(sequelize, DataTypes) {
  var Banner = sequelize.define('Banner', {
    picture: {
      type: DataTypes.STRING,
      defaultValue: '/img/nopicture/banner.png'
    },
    url: {
    	type: DataTypes.STRING,
      defaultValue: '/'
    }
  })
  return Banner;
};