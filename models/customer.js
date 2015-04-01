module.exports = function(sequelize, DataTypes) {
  var Customer = sequelize.define('Customer', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      defaultValue: ''
    }
  })
  return Customer;
};