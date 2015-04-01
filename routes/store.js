'use strict';

var db = require('../models'),
    fs = require('fs'),
    util = require('util'),
    formidable = require('formidable'),
    error = require('../routes/error');

exports.persist = function(req, res, next) {
  db.Store.find({
    where: {
      id: req.body.id
    }
  }).success(function(entity) {
    if(entity){
      entity.updateAttributes(req.body).success(function() {
        res.json({ success: 1, message: "Loja atualizada com sucesso!" });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }else{
      db.Store.create(req.body).success(function(entitySave) {
        res.json({ success: 1, message: "Loja salva com sucesso!", data: entitySave.id });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }
  });
};

exports.getById = function(req, res, next) {
  db.Store.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id', 'name', 'phone', 'email', 'treatment', 'manager', 'lat', 'lon']
  }).success(function(entity) {
    if (entity) {
      res.json({ success: 1, data: entity });
    } else {
      res.json({ success: 0, message: "Loja não encontrada!" });
    }
  })
};

exports.getAll = function(req, res, next) {
  db.Store.findAll({
    attributes: ['id', 'name', 'phone', 'email', 'treatment', 'manager']
  }).success(function(entities) {
    res.json({ success: 1, data: entities });
  })
};

exports.setPicture = function(req, res, next, __dirname, propriedade){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    fs.readFile(util.inspect(files.image.path).replace("'", "").replace("'", ""), function (err, data) {
      var nameArquivo = util.inspect(files.image.name).replace("'", "").replace("'", "");
      var novo = "/img/stores/" + propriedade + '-' +req.param('id') + ".png";
      var _p = {};
      _p[propriedade] = novo;
      fs.writeFile(__dirname + "/public" + novo, data, function (err) {
        db.Store.find({ where: { id: req.param('id') } }).success(function(entity) {
          if (entity) {
            entity.updateAttributes(_p).success(function(entitySalvo) {
              res.json({ success: 1, message: entitySalvo });
            })
          } else {
            res.json({ success: 0, message: "Loja não encontada!" });
          }
        });
      });
    });
  });
};

exports.getPicturesById = function(req, res, next) {
  db.Store.find({
    attributes: ['id', 'name', 'picture1', 'picture2', 'picture3', 'picture4'],
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
    if(entity){
      res.json({ success: 1, data: entity });
    }else{
      res.json({ success: 2, message: 'Loja não encontada!' });
    }
  })
};