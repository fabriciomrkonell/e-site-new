var db = require('../models');

exports.findById = function(id, fn) {
 	db.User.find({
    where: {
      id: id
    },
    attributes: [ 'id', 'name', 'email', 'password', 'GroupId' ]
  }).success(function(entity) {
    if (entity) {
      fn(null, entity);
    } else {
      fn(new Error(id));
    }
  });
};

exports.findByEmail = function(email, password, fn) {
 	db.User.find({ where: { email: email } }).success(function(entity) {
    if (entity) {
      if(password == entity.password){
        return fn(null, entity);
      }else{
        return fn(null, null);
      }
    } else {
      return fn(null, null);
    }
  });
};

exports.getPages = function(GroupId, fn) {
  db.GroupPage.findAll({
    where: {
      GroupId: GroupId
    },
    attributes: [ 'id' ],
    order: 'Page.position ASC',
    include: [ {
      model: db.Page,
      attributes: [ 'id', 'description', 'name', 'position']
    }]
  }).success(function(entities) {
    fn(null, entities);
  });
};