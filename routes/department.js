'use strict';

var db = require('../models'),
    fs = require('fs'),
    util = require('util'),
    formidable = require('formidable'),
    error = require('../routes/error');

exports.persist = function(req, res, next) {
  db.Department.find({
    where: {
      id: req.body.id
    }
  }).success(function(entity) {
    if(entity){
      entity.updateAttributes(req.body).success(function() {
        res.json({ success: 1, message: "Departamento atualizado com sucesso!" });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }else{
      db.Department.create(req.body).success(function(entityDepartmentSalvo) {
        res.json({ success: 1, message: "Departamento salvo com sucesso!", data: entityDepartmentSalvo.id });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }
  });
};

exports.getById = function(req, res, next) {
  db.Department.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id', 'description', 'message']
  }).success(function(entity) {
    if (entity) {
      res.json({ success: 1, data: entity });
    } else {
      res.json({ success: 0, message: "Departamento não encontrada!" });
    }
  })
};

exports.getAll = function(req, res, next) {
  db.Department.findAll({
    attributes: ['id', 'description', 'message']
  }).success(function(entities) {
    res.json({ success: 1, data: entities });
  })
};