var db = require('../models'),
    nodemailer = require('nodemailer'),
    NodePDF = require('nodepdf');

function getHTML(obj) {
  var _ = '';
  for(var i = 0; i < obj.length; i++){
    _ = _ + '<strong>Código: </strong>' + obj[i].Product.code + '<br>';
    _ = _ + '<strong>Descricao: </strong>' + obj[i].Product.description + '<br>';
    _ = _ + '<strong>Valor: </strong>' + obj[i].Product.newValue + '<br>';
    _ = _ + '<strong>Valido até: </strong>' + getFormatDataPDF(obj[i].Sale.finishDate) + '<br><br>';
  }
  return _;
};

function getFormatDataPDF(data){
  if(!data){
    return '';
  }
  data = data.toString();
  return data.slice(6, 8) + '/' + data.slice(4, 6) + '/' + data.slice(0, 4);;
};

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

exports.enviar = function(req, res, next) {
  if(!req.body.name){
    return res.json({ success: 0, message: "Favor preencher todos os campos!" });
  }
  if(!req.body.subject){
    return res.json({ success: 0, message: "Favor preencher todos os campos!" });
  }
  if(!req.body.message){
    return res.json({ success: 0, message: "Favor preencher todos os campos!" });
  }

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
      var html = '<div style="font-size: 18px"><b>Nome</b>: ' + req.body.name + '<br>';
      html = html + '<b>Email</b>: ' + req.body.email + '<br>';
      html = html + '<b>Telefone</b>: ' + req.body.phone + '<br>';
      html = html + '<b>Assunto</b>: ' + req.body.subject + '<br>';
      html = html + '<b>Mensagem</b>: ' + req.body.message;
      html = html + '</div>';
      var mailOptions = {
        to: entityEmail.email,
        from: entityEmail.email,
        subject: 'Nova Mensagem - ' + req.body.subject,
        html: html
      };
      transporter.sendMail(mailOptions);
    }
  });
  res.json({ success: 1, message: "Mensagem enviada com sucesso!" });
};

exports.recoverPassword = function(req, res, next) {
  console.log(req.body);
  db.User.find({
    attributes: [ 'id', 'email', 'password'],
    where: {
      email: req.body.username
    }
  }).success(function(entityUser){
    if(entityUser){
      db.Email.find({
        attributes: [ 'id', 'configuration', 'host', 'port', 'email', 'password', 'status' ],
        where: {
          configuration: 'recover-password',
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
          var html = '<div style="font-size: 18px"><b>Sua senha é: </b>: ' + entityUser.email + '<br></div>';
          var mailOptions = {
            to: entityUser.email,
            from: entityEmail.email,
            subject: 'Recuperação de senha',
            html: html
          };
          transporter.sendMail(mailOptions);
        }
      });
      res.json({ success: 1, message: "Senha enviada para o email cadastrado!" });
    }else{
      res.json({ success: 0, message: "Nenhum usuário encontrado!" });
    }
  });
};

exports.salesstars = function(req, res, next) {
  var data = getFormatData(new Date()),
      condicao = {
        model: db.Product,
        attributes: [ 'id', 'description', 'picture1', 'newValue', 'DepartmentId' ]
      },
      _products = [],
      _array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'aa', 'bb', 'cc', 'dd', 'ee'];

  for(var i = 0; i < _array.length; i++){
    if(req.param(_array[i])){
      _products.push(parseInt(req.param(_array[i])))
    }
  }

  db.Sale.findAll({
    order: 'startDate DESC',
    where: ["? >= startDate and ? <= finishDate", data, data],
    attributes: ['id']
  }).success(function(entitySale) {
    var promocoes = [];
    for(var i = 0; i < entitySale.length; i++){
      promocoes.push(entitySale[i].id);
    };
    db.Association.findAll({
      where: {
        SaleId: promocoes,
        ProductId: _products
      },
      attributes: ['id'],
      order: 'Product.description ASC',
      include: [ condicao ]
    }).success(function(entityAssociation) {
      res.json(entityAssociation);
    });
  });
};

exports.createPDF = function(req, res, next) {
  var data = getFormatData(new Date()),
      condicao = [
        {
          model: db.Product,
          attributes: [ 'code', 'description', 'newValue' ]
        }, {
          model: db.Sale,
        }
      ],
      _products = [],
      _array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'aa', 'bb', 'cc', 'dd', 'ee'];

  for(var i = 0; i < _array.length; i++){
    if(req.param(_array[i])){
      _products.push(parseInt(req.param(_array[i])))
    }
  }

  db.Sale.findAll({
    order: 'startDate DESC',
    where: ["? >= startDate and ? <= finishDate", data, data],
    attributes: ['id']
  }).success(function(entitySale) {
    var promocoes = [];
    for(var i = 0; i < entitySale.length; i++){
      promocoes.push(entitySale[i].id);
    };
    db.Association.findAll({
      where: {
        SaleId: promocoes,
        ProductId: _products
      },
      attributes: ['id'],
      order: 'Product.description ASC',
      include: condicao
    }).success(function(entityAssociation) {

      var pdf = new NodePDF(null, 'public/pdf/pdf-favoritos-' + Math.floor((Math.random() * 100) + 1) + '.pdf', {
        'content': getHTML(entityAssociation),
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

    });
  });
};

exports.star = function(req, res, next) {
  db.Produto.find({
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
    if(entity){
      entity.updateAttributes({ stars: (entity.stars + 1) }).success(function() {
        res.json({ success: 1 });
      })
    }else{
      res.json({ success: 0 });
    }
  });
};