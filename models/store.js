module.exports = function(sequelize, DataTypes) {
  var Store = sequelize.define('Store', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING
    },
    treatment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    manager: {
      type: DataTypes.STRING
    },
    picture1: {
      type: DataTypes.STRING,
      defaultValue: '/img/nopicture/store.png'
    },
    picture2: {
      type: DataTypes.STRING,
      defaultValue: '/img/nopicture/store.png'
    },
    picture3: {
      type: DataTypes.STRING,
      defaultValue: '/img/nopicture/store.png'
    },
    picture4: {
      type: DataTypes.STRING,
      defaultValue: '/img/nopicture/store.png'
    },
    picture5: {
      type: DataTypes.STRING,
      defaultValue: '/img/nopicture/store.png'
    },
    lat: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    lon: {
      type: DataTypes.STRING,
      defaultValue: ''
    }
  })
  return Store;
};