'use strict';

var db = require('../models'),
    error = require('../routes/error');

exports.persist = function(req, res, next) {
  db.Group.find({
    where: {
      id: req.body.id
    }
  }).success(function(entity) {
    if(entity){
      entity.updateAttributes(req.body).success(function() {
        res.json({ success: 1, message: "Grupo atualizado com sucesso!" });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }else{
      db.Group.create(req.body).success(function(entityGroup) {
        res.json({ success: 1, message: "Grupo salvo com sucesso!", data: entityGroup.id });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }
  });
};

exports.getById = function(req, res, next) {
  db.Group.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id', 'description']
  }).success(function(entity) {
    if (entity) {
      res.json({ success: 1, data: entity });
    } else {
      res.json({ success: 0, message: "Grupo não encontrado!" });
    }
  })
};

exports.getAll = function(req, res, next) {
  db.Group.findAll({
    attributes: ['id', 'description']
  }).success(function(entities) {
    res.json({ success: 1, data: entities });
  })
};

exports.excluir = function(req, res, next) {
  db.Group.find({
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.json({ success: 1, message: "Grupo excluído com sucesso!" });
      })
    } else {
      res.json({ success: 0, message: "Grupo não encontrado!" });
    }
  })
}