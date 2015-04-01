'use strict';

var db = require('../models'),
    error = require('../routes/error');

exports.persist = function(req, res, next) {
  db.Menu.find({
    where: {
      id: req.body.id
    }
  }).success(function(entityMenu) {
    if(entityMenu){
      entityMenu.updateAttributes(req.body).success(function() {
        res.json({ success: 1, message: "Menu atualizado com sucesso!" });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }else{
      db.Menu.create(req.body).success(function(entityMenuSalvo) {
        res.json({ success: 1, message: "Menu salvo com sucesso!", data: entityMenuSalvo.id });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }
  });
};

exports.getById = function(req, res, next) {
  db.Menu.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id', 'description', 'url', 'status', 'position']
  }).success(function(entity) {
    if (entity) {
      res.json({ success: 1, data: entity });
    } else {
      res.json({ success: 0, message: "Menu não encontrada!" });
    }
  })
};

exports.getAll = function(req, res, next) {
  db.Menu.findAll({
    attributes: ['id', 'description', 'url', 'status', 'position']
  }).success(function(entities) {
    res.json({ success: 1, data: entities });
  })
};

exports.excluir = function(req, res, next) {
  db.Menu.find({
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.json({ success: 1, message: "Menu excluído com sucesso!" });
      })
    } else {
      res.json({ success: 0, message: "Menu não encontrado!" });
    }
  })
}