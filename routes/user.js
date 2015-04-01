var db = require('../models'),
    error = require('../routes/error');

exports.persist = function(req, res, next) {
  db.User.find({
    where: {
      email: req.body.email,
      id: {
        not: req.body.id
      }
    }
  }).success(function(entity) {
    if(entity){
      res.json({ success: 0, message: "Já existe um usuário com esse email!" });
    }else{
      db.User.find({
        where: {
          id: req.body.id
        }
      }).success(function(entityUser) {
        if(entityUser){
          entityUser.updateAttributes(req.body).success(function() {
            res.json({ success: 1, message: "Usuário atualizado com sucesso!" });
          }).error(function(err){
            error.error(req, res, next, err);
          });
        }else{
          if(req.body.password == null || req.body.password == ''){
            error.error(req, res, next);
          }else{
            req.body.password = req.body.password;
            db.User.create(req.body).success(function(entityUser) {
              res.json({ success: 1, message: "Usuário criado com sucesso!", data: entityUser.id });
            }).error(function(err){
              error.error(req, res, next, err);
            });
          }
        }
      });
    }
  })
};

exports.getAll = function(req, res, next) {
  db.User.findAll({
    attributes: [ 'id', 'name', 'email', 'GroupId' ],
    include: [ {
      model: db.Group,
      attributes: [ 'description' ]
    }]
  }).success(function(entities) {
    res.json({ success: 1, data: entities });
  })
};

exports.getById = function(req, res, next) {
  db.User.find({
    where: {
      id: req.param('id')
    },
    attributes: [ 'id', 'name', 'email', 'GroupId']
  }).success(function(entity) {
    if (entity) {
      res.json({ success: 1, data: entity });
    } else {
      res.json({ success: 0, message: "Usuário não encontrado!" });
    }
  })
};

exports.getPages = function(req, res, next) {
  res.json(req.user);
};

exports.getUserMe = function(req, res, next) {
  res.json({
    success: 1,
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    } });
};

exports.viewPersistUser = function(req, res, next) {
  var _return = {};
  db.Group.findAll({
    attributes: ['id', 'description']
  }).success(function(entityGroups) {
    _return.Groups = entityGroups;
    res.json({ success: 1, data: _return });
  })
};

exports.setPassword = function(req, res, next){
  console.log(req.body);
  if(!req.body.newPassword){
    res.json({ success: 0, message: "Nova senha não permitida!" });
  }else{
    if(req.body.password == req.user.password){
      db.User.find({
        where: {
          id: req.user.id
        }
      }).success(function(entity) {
        req.body.password = req.body.newPassword;
        entity.updateAttributes({ password: req.body.password }).success(function(entity) {
          res.json({ success: 1, message: "Senha atualizada com sucesso!" });
        }).error(function(err){
          error.error(req, res, next, err);
        });
      });
    }else{
      res.json({ success: 0, message: "Senha antiga inválida!" });
    }
  };
};