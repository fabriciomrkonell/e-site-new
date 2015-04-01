'use strict';

var db = require('../models'),
    error = require('../routes/error');

exports.persist = function(req, res, next) {
  db.Email.find({
    where: {
      id: req.body.id
    }
  }).success(function(entityEmail) {
    if(entityEmail){
      entityEmail.updateAttributes(req.body).success(function() {
        res.json({ success: 1, message: "Email atualizado com sucesso!" });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }else{
      db.Email.create(req.body).success(function(entityEmailSave) {
        res.json({ success: 1, message: "Email salvo com sucesso!", data: entityEmailSave.id });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }
  });
};

exports.getById = function(req, res, next) {
  db.Email.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id', 'configuration', 'host', 'port', 'email', 'password', 'status']
  }).success(function(entity) {
    if (entity) {
      res.json({ success: 1, data: entity });
    } else {
      res.json({ success: 0, message: "Menu não encontrada!" });
    }
  })
};

exports.getAll = function(req, res, next) {
  db.Email.findAll({
    attributes: ['id', 'configuration', 'host', 'port', 'email', 'password', 'status']
  }).success(function(entities) {
    res.json({ success: 1, data: entities });
  })
};

exports.excluir = function(req, res, next) {
  db.Email.find({
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.json({ success: 1, message: "Email excluído com sucesso!" });
      })
    } else {
      res.json({ success: 0, message: "Email não encontrado!" });
    }
  })
}