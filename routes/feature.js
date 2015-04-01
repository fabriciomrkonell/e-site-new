'use strict';

var db = require('../models'),
    error = require('../routes/error');

exports.persist = function(req, res, next) {
  db.Feature.find({
    where: {
      id: req.body.id
    }
  }).success(function(entityFeature) {
    if(entityFeature){
      entityFeature.updateAttributes(req.body).success(function() {
        res.json({ success: 1, message: "Característica atualizada com sucesso!" });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }else{
      db.Feature.create(req.body).success(function(entityFeatureSave) {
        res.json({ success: 1, message: "Característica salva com sucesso!", data: entityFeatureSave });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }
  });
};

exports.getAll = function(req, res, next) {
  db.Product.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id', 'description']
  }).success(function(entityProduct) {
    if(entityProduct){
      db.Feature.findAll({
        where: {
          ProductId: req.param('id')
        },
        attributes: ['id', 'description', 'feature', 'ProductId']
      }).success(function(entitiesFeature) {
        res.json({ success: 1, data: { Product: entityProduct, features: entitiesFeature }});
      });
    }else{
      res.json({ success: 2, message: "Produto não encontrado!" });
    }
  });
};

exports.excluir = function(req, res, next) {
  db.Feature.find({
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.json({ success: 1, message: "Característica excluída com sucesso!" });
      })
    } else {
      res.json({ success: 0, message: "Característica não encontrada!" });
    }
  })
}