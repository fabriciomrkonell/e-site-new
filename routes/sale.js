'use strict';

var db = require('../models'),
    excelParser = require('node-xlsx'),
    product = require('../routes/product'),
    formidable = require('formidable'),
    error = require('../routes/error');

function getFormatData(data){
  var retorno = data.getFullYear();
  if(parseInt(data.getMonth() + 1) < 10){
    retorno = retorno + "0" + parseInt(data.getMonth() + 1);
  }else{
    retorno = retorno + parseInt(data.getMonth() + 1);
  }
  if(parseInt(data.getDate()) < 10){
    retorno = retorno + "0" + parseInt(data.getDate());
  }else{
    retorno = retorno + parseInt(data.getDate());
  }
  return parseInt(retorno);
};

exports.persist = function(req, res, next) {
  db.Sale.find({
    where: {
      id: req.body.id
    },
    attributes: ['id', 'description', 'startDate', 'finishDate', 'products']
  }).success(function(entity) {
    if(entity){
      entity.updateAttributes(req.body).success(function(entity) {
        res.json({ success: 1, message: "Promoção atualizada com sucesso!" });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }else{
      db.Sale.create(req.body).success(function(entitySave) {
        res.json({ success: 1, message: "Promoção criada com sucesso!", data: entitySave.id });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }
  });
};

exports.persistExcel = function(req, res, next){
  var form = new formidable.IncomingForm(),
      dados = [], flag;
  form.parse(req, function(err, fields, files) {
    if(files.excel.name.indexOf('xlsx') == '-1'){
      return res.json({ success: 0, message: "Arquivo inválido!" });
    }
    if(files.excel.size == 0){
      return res.json({ success: 0, message: "Excel inválido!" });
    };
    var data = excelParser.parse(files.excel.path);
    data = data[0].data;
    if(data.length == 0){
      return res.json({ success: 0, message: "Excel sem produtos!" });
    }
    if(err) throw err;
    for(var i = 0; i < data.length; i++){
      if(parseInt(data[i][0])){
        flag = true;
        for(var j = 0; j < dados.length; j++){
          if(data[i][0] == dados[j][0]){
            flag = false;
          }
        }
        if(flag){
          dados.push(data[i])
        }
      };
    };
    if(!dados[0]){
      return res.json({ success: 0, message: "Excel inválido!" });
    }else{
      product.persistExcel(dados[0][0], dados[0], dados[dados.length - 1][0], 0, dados.length, req.param('id'), res, dados);
    }
    dados = null;
    dados = [];
  });
};

exports.getAll = function(req, res, next) {
  var data = getFormatData(new Date());
  db.Sale.findAll({
    order: 'startDate DESC',
    limit: 10,
    where: [ "startDate > ?", data],
    attributes: ['id', 'description', 'startDate', 'finishDate', 'products']
  }).success(function(entitiesNextSales) {
    db.Sale.findAll({
      order: 'startDate ASC',
      where: ["? >= startDate and ? <= startDate", data, data],
      attributes: ['id', 'description', 'startDate', 'finishDate', 'products']
    }).success(function(entitiesTodaySales){
      res.json({
        success: 1,
        data: {
          next: entitiesNextSales,
          today: entitiesTodaySales
        }
      });
    });
  });
};

exports.excluir = function(req, res, next) {
  db.Sale.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id']
  }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.json({ success: 1, message: "Promoção excluida com secesso!" });
      })
    } else {
      res.json({ success: 0, message: "Promoção não encontrada!" });
    }
  });
};

exports.getById = function(req, res, next) {
  db.Sale.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id', 'description', 'startDate', 'finishDate', 'products']
  }).success(function(entity) {
    if (entity) {
      res.json({ success: 1, data: entity });
    } else {
      res.json({ success: 0, message: "Promoção não encontrada!" });
    }
  })
};

exports.getAllById = function(req, res, next) {
  db.Sale.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id', 'description', 'startDate', 'finishDate', 'products']
  }).success(function(entitySale) {
    if (entitySale) {
      db.Association.findAll({
        where: {
          SaleId: entitySale.id
        },
        attributes: ['id'],
        order: 'Product.description ASC',
        include: [ {
          model: db.Product,
          attributes: [ 'id', 'description', 'newValue', 'code', 'picture1'],
          order: 'Product.id ASC'
        }]
      }).success(function(entityAssociation) {
        res.json({ success: 1, data: { sale: entitySale, products: entityAssociation } });
      });
    } else {
      res.json({ success: 0, message: "Promoção não encontrada!" });
    }
  })
};


exports.excluirProduct = function(req, res, next) {
  db.Association.find({
    where: {
      id: req.param('id')
    }
  }).success(function(entity){
    if(entity){
      entity.destroy().success(function(){
        db.Sale.find({
          where: {
            id: entity.SaleId
          }
        }).success(function(entitySale){
          entitySale.updateAttributes({ products: entitySale.products - 1 }).success(function(){
            res.json({ success: 1, message: "Produto excluído da promoção!" });
          }).error(function(err){
            error.error(req, res, next, err);
          });
        });
      });
    }else{
      res.json({ success: 0, message: "Associação não encontrada!" });
    }
  });
};

exports.persistProduct = function(req, res, next) {
  db.Association.create({
    ProductId: req.body.product,
    SaleId: req.body.sale
  }).success(function() {
    db.Sale.find({
      where: {
        id: req.body.sale
      }
    }).success(function(entitySale) {
      entitySale.updateAttributes({ products: entitySale.products + 1 }).success(function(){
        res.json({ success: 1, message: "Produto adicionado a promoção com sucesso!" });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }).error(function(err){
      error.error(req, res, next, err);
    });
  }).error(function(){
    res.json({ success: 0, message: "Promoção ou produto não encontrados!" });
  });
};