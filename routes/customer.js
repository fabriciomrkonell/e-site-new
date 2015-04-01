'use strict';

var db = require('../models'),
    site = require('../configs/site');

exports.persist = function(req, res, next) {
  if(req.body.name != '' && req.body.email != ''){
    db.Customer.create(req.body).success(function(entity) {
      site.register(req, res, next, "Cadastro efetuado com sucesso!", {});
    }).error(function(error){
      site.register(req, res, next, "Favor preencher os campos obrigatórios!", req.body);
    });
  }else{
    site.register(req, res, next, "Favor preencher os campos obrigatórios!", req.body);
  }
};

exports.getAll = function(req, res, next) {
  db.Customer.findAll({
    attributes: [ 'id', 'name', 'email', 'phone' ],
    order: 'name ASC'
  }).success(function(entities) {
    res.json({ success: 1, data: entities });
  });
};

exports.excluir = function(req, res, next) {
  db.Customer.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id']
  }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.json({ success: 1, message: "Cliente excluído com sucesso!" });
      });
    }else{
      res.json({ success: 0, message: "Cliente não encontrado!" });
    }
  })
};