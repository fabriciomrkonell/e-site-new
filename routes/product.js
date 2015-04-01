'use strict';

var db = require('../models'),
    fs = require('fs'),
    util = require('util'),
    formidable = require('formidable'),
    error = require('../routes/error'),
    produtos = [],
    _produtoAtual = 0;

function getValorProduto(valor){
  return parseFloat(valor).toFixed(2).toString().replace(".", ",");
};

function end(ultimo, code, _entity, _res, _sale, _data){
  produtos.push({ SaleId: _sale, ProductId: parseInt(_entity.id) });
  if(ultimo == code){
    _produtoAtual = 0;
    db.Sale.find({
      where: {
        id: _sale
      }
    }).success(function(entitySale) {
      if (entitySale) {
        db.Association.destroy({
          where: {
            SaleId: entitySale.id
          }
        }).success(function(){
          db.Association.bulkCreate(produtos).then(function() {
            entitySale.updateAttributes({ products: produtos.length }).success(function() {
              _res.json({ success: 1, message: "Produtos adicionados com sucesso!" });
              produtos = null;
              produtos = [];
            })
          });
        });
      }else{
        _res.json({ success: 0, message: "Promoção não encontrada!" });
      }
    });
  }else{
    _produtoAtual = _produtoAtual + 1;
    persistExcel(_data[_produtoAtual][0], _data[_produtoAtual], _data[_data.length - 1][0], _produtoAtual, _data.length, _sale, _res, _data);
  }
}

function persistExcel(code, data, ultimo, atual, total, _sale, _res, _produtoTodos) {
  db.Product.find({
    where: {
      code: code
    }
  }).success(function(entity) {
    if (entity) {
      entity.updateAttributes({ newValue: getValorProduto(data[3]) }).success(function(entityProdutoSalvo) {
        end(ultimo, code, entityProdutoSalvo, _res, _sale, _produtoTodos);
      })
    } else {
      var _produto = {
        code: code,
        description: data[1],
        newValue: getValorProduto(data[3]),
        DepartmentId: parseInt(data[2])
      };
      db.Product.create(_produto).success(function(entityProdutoNovo) {
        end(ultimo, code, entityProdutoNovo, _res, _sale, _produtoTodos);
      }).error(function(error){
        produtos = null;
        produtos = [];
        _produtoAtual = 0;
        _res.json({ success: 0, message: data[1] });
      });
    }
  });
};

exports.getAll = function(req, res, next) {
  db.Product.findAll({
    attributes: ['id', 'code', 'description', 'newValue']
  }).success(function(entities) {
    res.json({ success: 1, data: entities });
  })
};

exports.persistExcel = function(code, data, ultimo, atual, total, _sale, _res, _produtoTodos) {
  persistExcel(code, data, ultimo, atual, total, _sale, _res, _produtoTodos);
};

exports.excluir = function(req, res, next) {
  db.Product.find({
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.json({ success: 1, message: "Produto excluído com secesso!" });
      })
    } else {
      res.json({ success: 0, message: "Produto não encontrado!" });
    }
  })
}

exports.autocomplete = function(req, res, next) {
  db.Product.findAll({
    where: "Product.code LIKE '%" + req.param('exp') + "%' OR Product.description LIKE '%" + req.param('exp') + "%'",
    attributes: ['id', 'code', 'description', 'newValue', 'picture1'],
    limit: 10,
    include: [ { model: db.Department, attributes: [ 'description' ] } ]
  }).success(function(entities) {
    res.json(entities);
  })
}

exports.autocompleteNoStar = function(req, res, next) {
  db.Product.findAll({
    where: "(code LIKE '%" + req.param('exp') + "%' OR Product.description LIKE '%" + req.param('exp') + "%') and star = 0 ",
    attributes: ['id', 'code', 'description', 'newValue', 'picture1'],
    limit: 10,
    include: [ { model: db.Department, attributes: [ 'description' ] } ]
  }).success(function(entities) {
    res.json(entities);
  })
}

exports.getById = function(req, res, next) {
  db.Product.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id', 'code', 'description', 'newValue', 'DepartmentId', 'picture1'],
    include: [ { model: db.Department, attributes: [ 'description' ] } ]
  }).success(function(entity) {
    if(entity){
       res.json({ success: 1, data: entity });
    }else{
      res.json({ success: 0, message: "Produto não encontrado!" });
    }
  })
}

exports.persist = function(req, res, next) {
  db.Product.find({
    where: {
      id: req.body.id
    }
  }).success(function(entity) {
    if(entity){
      entity.updateAttributes({
        newValue: req.body.newValue,
        description: req.body.description,
        DepartmentId: req.body.DepartmentId || entity.DepartmentId
      }).success(function(){
        res.json({ success: 1, message: "Produto atualizado com sucesso!" });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }else{
      db.Product.create(req.body).success(function(entityProductSave){
        res.json({ success: 1, message: "Produto salvo com sucesso!", data: entityProductSave.id });
      }).error(function(err){
        console.log(err);
        error.error(req, res, next, err);
      });
    }
  });
};

exports.setPicture = function(req, res, next, __dirname, propriedade){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    fs.readFile(util.inspect(files.image.path).replace("'", "").replace("'", ""), function (err, data) {
      var nameArquivo = util.inspect(files.image.name).replace("'", "").replace("'", "");
      var novo = "/img/products/" + propriedade + '-' +req.param('id') + ".png";
      var _p = {};
      _p[propriedade] = novo;
      fs.writeFile(__dirname + "/public" + novo, data, function (err) {
        db.Product.find({ where: { id: req.param('id') } }).success(function(entity) {
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

exports.getAllByStar = function(req, res, next) {
  db.Product.findAll({
    where: {
      star: true
    },
    attributes: [ 'id', 'code', 'description', 'newValue']
  }).success(function(entities) {
    res.json({ success: 1, data: entities });
  });
};

exports.persistStar = function(req, res, next) {
  db.Product.find({
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
    if(entity){
      var star = false;
      if(entity.star == false){
        star = true;
      }
      entity.updateAttributes({ star: star }).success(function(entitySalvo) {
        res.json({ success: 1, message: "Produto atualizado com sucesso!" });
      })
    }else{
      res.json({ success: 0, message: "Produto não encontado!" });
    }
  });
};

exports.getPicturesById = function(req, res, next) {
  db.Product.find({
    attributes: ['id', 'description', 'picture1', 'picture2', 'picture3', 'picture4'],
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
    if(entity){
      res.json({ success: 1, data: entity });
    }else{
      res.json({ success: 2, message: 'Produto não encontada!' });
    }
  })
};

exports.viewPersistProduct = function(req, res, next) {
  var _return = {};
  db.Department.findAll({
    attributes: ['id', 'description']
  }).success(function(entityDepartments) {
    _return.Departments = entityDepartments;
    res.json({ success: 1, data: _return });
  })
};