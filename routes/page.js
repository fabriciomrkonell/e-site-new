'use strict';

var db = require('../models'),
    error = require('../routes/error');

exports.persist = function(req, res, next) {
  db.Page.find({
    where: {
      id: req.body.id
    }
  }).success(function(entityPage) {
    if(entityPage){
      entityPage.updateAttributes(req.body).success(function() {
        res.json({ success: 1, message: "Página atualizada com sucesso!" });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }else{
      db.Page.create(req.body).success(function(entityPageSave) {
        res.json({ success: 1, message: "Página salva com sucesso!", data: entityPageSave.id });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }
  });
};

exports.getById = function(req, res, next) {
  db.Page.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id', 'description', 'name', 'position'],
    order: 'position ASC'
  }).success(function(entity) {
    if (entity) {
      res.json({ success: 1, data: entity });
    } else {
      res.json({ success: 0, message: "Menu não encontrada!" });
    }
  })
};

exports.getAll = function(req, res, next) {
  db.Page.findAll({
    attributes: ['id', 'description', 'name', 'position'],
    order: 'position ASC'
  }).success(function(entities) {
    res.json({ success: 1, data: entities });
  })
};

exports.excluir = function(req, res, next) {
  db.Page.find({
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.json({ success: 1, message: "Página excluída com sucesso!" });
      })
    } else {
      res.json({ success: 0, message: "Página não encontrado!" });
    }
  })
}