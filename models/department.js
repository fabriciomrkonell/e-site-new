module.exports = function(sequelize, DataTypes) {
  var Department = sequelize.define('Department', {
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      defaultValues: ''
    }
  }, {
    classMethods: {
      associate: function(models) {
        Department.hasMany(models.Product);
      }
    }
  });
  return Department;
};
