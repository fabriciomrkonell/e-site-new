'use strict';

var db = require('../models'),
    site = require('../configs/site'),
    nodemailer = require('nodemailer'),
    fs = require('fs'),
    NodePDF = require('nodepdf'),
    util = require('util'),
    formidable = require('formidable');

function valid(curriculo) {
  if(!curriculo.nome){
    return false;
  }
  if(!curriculo.email){
    return false;
  }
  if(!curriculo.cidade){
    return false;
  }
  if(!curriculo.bairro){
    return false;
  }
  if(!curriculo.telefone){
    return false;
  }
  return true;
};

function sendEmail(entity) {
  db.Email.find({
    attributes: [ 'id', 'configuration', 'host', 'port', 'email', 'password', 'status' ],
    where: {
      configuration: 'work-with-us',
      status: true
    }
  }).success(function(entityEmail){
    if(entityEmail){
      var transporter = nodemailer.createTransport("SMTP", {
        host: entityEmail.host,
        port: entityEmail.port,
        auth: {
          user: entityEmail.email,
          pass: entityEmail.password
        }
      });
      var html = '<div style="font-size: 18px"><b>Nome</b>: ' + entity.nome + '<br>';
      html = html + '<b>Email</b>: ' + entity.email + '<br>';
      html = html + '<b>Nascimento</b>: ' + entity.nascimento + '<br>';
      html = html + '<b>Endereço</b>: ' + entity.cidade + ' - ' + entity.estado + '<br>';
      html = html + '<b>Telefone</b>: ' + entity.telefone + '<br>';
      html = html + '</div>';
      var mailOptions = {
        to: entityEmail.email,
        from: entityEmail.email,
        subject: 'Currículo - ' + entity.nome,
        html: html
      };
      transporter.sendMail(mailOptions);
    }
  });
};

function getHTML(obj) {
  var _ = '';
  _ = _ + '<strong>Nome: </strong>' + obj.nome + '<br>';
  _ = _ + '<strong>Email: </strong>' + obj.email + '<br>';
  _ = _ + '<strong>Data de Nascimento: </strong>' + obj.nascimento + '<br>';
  _ = _ + '<strong>Sexo: </strong>' + obj.sexo + '<br><br>';
  _ = _ + '<strong>Bairro: </strong>' + obj.bairro + '<br>';
  _ = _ + '<strong>Cidade: </strong>' + obj.cidade + '<br>';
  _ = _ + '<strong>Estado: </strong>' + obj.estado + '<br><br>';
  _ = _ + '<strong>Telefone: </strong>' + obj.telefone + '<br>';
  _ = _ + '<strong>Celular: </strong>' + obj.celular + '<br><br>';
  _ = _ + '<strong>Salário atual: </strong>' + obj.salarioAtual + '<br><br>';
  _ = _ + '<strong>Trabalha? </strong>' + obj.trabalha + '<br>';
  _ = _ + '<strong>Onde conheceu o site? </strong>' + obj.conheceuSite + '<br><br>';
  _ = _ + '<strong>Cargo desejado: </strong>' + obj.cargo + '<br>';
  _ = _ + '<strong>Área de profissional: </strong>' + obj.area + '<br>';
  _ = _ + '<strong>Nível hierárquico: </strong>' + obj.hierarquico + '<br><br>';
  _ = _ + '<strong>Outras empresas: </strong>' + obj.outrasEmpresas;
  return _;
};

exports.persist = function(req, res, next, __dirname) {
  var form = new formidable.IncomingForm();
  var documento = '';
  form.parse(req, function(err, fields, files) {
    if(valid(fields)){
      fields.nascimento = fields.day + '/' + fields.month + '/' + fields.year;
      if(files.curriculo.size > 0){
        var _documento = files.curriculo.name.split(".");
        documento = _documento[_documento.length - 1];
        fields.documento = documento;
      }
      db.Curriculo.create(fields).success(function(entity) {
        sendEmail(entity);
        if(files.curriculo.size > 0){
          fs.readFile(util.inspect(files.curriculo.path).replace("'", "").replace("'", ""), function (err, data) {
            var novo = "/curriculos/" + entity.id + '.' + documento;
            fs.writeFile(__dirname + "/public" + novo, data, function (err) {
              site.workWithUs(req, res, next, "Curriculo enviado com sucesso!", {});
            });
          });
        }else{
          site.workWithUs(req, res, next, "Curriculo enviado com sucesso!", {});
        }
      }).error(function(error){
        site.workWithUs(req, res, next, error, fields);
      });
    }else{
      site.workWithUs(req, res, next, "Favor preencher os campos obrigatórios!", fields);
    }
  });
};

exports.getAll = function(req, res, next) {
  db.Curriculo.findAll({
    attributes: [ 'id', 'nome', 'bairro', 'email', 'nascimento', 'cidade', 'telefone', 'salarioAtual', 'trabalha', 'documento' ],
    order: 'nome ASC'
  }).success(function(entities) {
    res.json({ success: 1, data: entities });
  });
};

exports.createDocumento = function(req, res, next, __dirname) {
  db.Curriculo.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id', 'documento']
  }).success(function(entity) {
    if (entity) {
      if(entity.documento != null){
        res.download(__dirname + '/public/curriculos/' + entity.id + '.' + entity.documento);
      }else{
        res.json({ success: 0, message: "Currículo não encontrado" });
      }
    }else{
      res.json({ success: 0, message: "Currículo não encontrado" });
    }
  })
};

exports.createPDF = function(req, res, next) {
  db.Curriculo.find({
    attributes: [ 'id','nome', 'bairro', 'email', 'nascimento', 'sexo', 'cidade', 'estado', 'telefone', 'celular', 'salarioAtual', 'trabalha', 'conheceuSite', 'cargo', 'hierarquico', 'area', 'outrasEmpresas'],
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
    if(entity){
      var pdf = new NodePDF(null, 'public/pdf/' + entity.id + '.pdf', {
        'content': getHTML(entity),
        'viewportSize': {
          'width': 1440,
          'height': 900
        }
      });

      pdf.on('error', function(error){
        res.json({ success: 0, message: error });
      });

      pdf.on('done', function(pathToFile){
        res.sendfile(pathToFile);
      });

    }else{
      res.json({ success: 0, message: "Currículo não encontrado" });
    }
  });
};

exports.excluir = function(req, res, next) {
  db.Curriculo.find({
    where: {
      id: req.param('id')
    },
    attributes: ['id']
  }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.json({ success: 1, message: "Curriculo excluído com sucesso!" });
      });
    }else{
      res.json({ success: 0, message: "Curriculo não encontrado!" });
    }
  })
};