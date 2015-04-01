var db = require('../models');

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
  return retorno;
};

exports.index = function(req, res, next) {
  db.Menu.findAll({
    where: {
      status: true
    },
    attributes: [ 'description', 'url' ],
    order: "position ASC"
  }).success(function(entityMenus) {
    db.Product.findAll({
      where: {
        star: 1
      },
      attributes: [ 'id', 'description', 'picture1', 'newValue', 'DepartmentId', 'star' ]
    }).success(function(entityProducts) {
      db.Banner.findAll({
        attributes: [ 'picture', 'url' ]
      }).success(function(entityBanners) {
        db.Department.findAll({
          attributes: [ 'description', 'id' ],
          order: 'description ASC'
        }).success(function(entityDepartments) {
          res.render('layouts/default', {
            title: 'Home',
            page: '/',
            menus: entityMenus,
            products: entityProducts,
            banners: entityBanners,
            departments: entityDepartments,
            departamento: false,
            expressao: ''
          });
        });
      });
    });
  });
};

exports.stars = function(req, res, next) {
  db.Menu.findAll({
    where: {
      status: true
    },
    attributes: [ 'description', 'url' ],
    order: "position ASC"
  }).success(function(entityMenus) {
    db.Department.findAll({
      attributes: [ 'description', 'id' ],
      order: 'description ASC'
    }).success(function(entityDepartments) {
      res.render('layouts/default', {
        title: 'Home',
        page: '/favoritos',
        menus: entityMenus,
        departments: entityDepartments,
      });
    });
  });
};


exports.history = function(req, res, next) {
  db.Menu.findAll({
    where: {
      status: true
    },
    attributes: [ 'description', 'url' ],
    order: "position ASC"
  }).success(function(entityMenus) {
    db.Banner.findAll({
      attributes: [ 'picture', 'url' ]
    }).success(function(entityBanners) {
      db.Department.findAll({
        attributes: [ 'description', 'id' ],
        order: 'description ASC'
      }).success(function(entityDepartments) {
        res.render('layouts/default', {
          title: 'Home',
          page: '/historia',
          menus: entityMenus,
          banners: entityBanners,
          departments: entityDepartments
        });
      });
    });
  });
};

exports.stores = function(req, res, next) {
  db.Menu.findAll({
    where: {
      status: true
    },
    attributes: [ 'description', 'url' ],
    order: "position ASC"
  }).success(function(entityMenus) {
    db.Store.findAll({
      attributes: [ 'id', 'name', 'phone', 'email', 'treatment', 'manager', 'picture1', 'picture2', 'picture3', 'picture4', 'lat', 'lon' ]
    }).success(function(entityStores) {
      db.Banner.findAll({
        attributes: [ 'picture', 'url' ]
      }).success(function(entityBanners) {
        db.Department.findAll({
          attributes: [ 'description', 'id' ],
          order: 'description ASC'
        }).success(function(entityDepartments) {
          res.render('layouts/default', {
            title: 'Home',
            page: '/lojas',
            menus: entityMenus,
            stores: entityStores,
            banners: entityBanners,
            departments: entityDepartments
          });
        });
      });
    });
  });
};

exports.sales = function(req, res, next) {
  db.Menu.findAll({
    where: {
      status: true
    },
    attributes: [ 'description', 'url' ],
    order: "position ASC"
  }).success(function(entityMenus) {
    var data = getFormatData(new Date()),
        pag = 1,
        offset = 0,
        condicao = { },
        dep = req.param('dep') || false,
        exp = req.param('exp') || '';

    if(parseInt(req.param('pag')) > 1){
      pag = parseInt(req.param('pag'));
      offset = (parseInt(req.param('pag')) * 21);
    }

    if(dep){
      if(exp != '' || exp != null){
        condicao = {
          model: db.Product,
          attributes: [ 'id', 'description', 'picture1', 'newValue', 'DepartmentId', 'star' ],
          where: {
            DepartmentId: dep,
            description: {
              like: "%" + exp + "%"
            }
          }
        }
      }else{
        condicao = {
          model: db.Product,
          attributes: [ 'id', 'description', 'picture1', 'newValue', 'DepartmentId','star' ],
          where: {
            DepartmentId: dep
          }
        }
      }
    }else{
      if(exp != '' || exp != null){
        condicao = {
          model: db.Product,
          attributes: [ 'id', 'description', 'picture1', 'newValue', 'DepartmentId', 'star' ],
          where: {
            description: {
              like: "%" + exp + "%"
            }
          }
        }
      }else{
        condicao = {
          model: db.Product,
          attributes: [ 'id', 'description', 'picture1', 'newValue', 'DepartmentId', 'star' ]
        }
      }
    }

    db.Department.findAll({
      attributes: [ 'description', 'id' ],
      order: 'description ASC'
    }).success(function(entityDepartments) {
      db.Sale.findAll({
        order: 'startDate DESC',
        limit: 10,
        where: ["? >= startDate and ? <= finishDate", data, data],
        attributes: ['id']
      }).success(function(entityPromocao) {
        var promocoes = [];
        for(var i = 0; i < entityPromocao.length; i++){
          promocoes.push(entityPromocao[i].id);
        };
        db.Association.findAll({
          offset: offset,
          limit: 21,
          where: {
            SaleId: promocoes
          },
          order: 'Product.description ASC',
          include: [ condicao ]
        }).success(function(entityAssociation) {
          if(entityAssociation.length < 1){
            pag = 1;
          }
          res.render('layouts/default', {
            title: 'Home',
            page: '/ofertas',
            pagina: pag,
            menus: entityMenus,
            departments: entityDepartments,
            products: entityAssociation,
            departamento: dep,
            expressao: exp
          });
        });
      });
    });
  });
};

exports.workWithUs = function(req, res, next, message, data) {
  db.Menu.findAll({
    where: {
      status: true
    },
    attributes: [ 'description', 'url' ],
    order: "position ASC"
  }).success(function(entityMenus) {
    db.Department.findAll({
      attributes: [ 'description', 'id' ],
      order: 'description ASC'
    }).success(function(entityDepartments) {
      res.render('layouts/default', {
        title: 'Home',
        page: '/trabalhe-conosco',
        menus: entityMenus,
        message: message,
        data: data || {},
        departments: entityDepartments
      });
    });
  });
};

exports.contact = function(req, res, next) {
  db.Menu.findAll({
    where: {
      status: true
    },
    attributes: [ 'description', 'url' ],
    order: "position ASC"
  }).success(function(entityMenus) {
    db.Department.findAll({
      attributes: [ 'description', 'id' ],
      order: 'description ASC'
    }).success(function(entityDepartments) {
      res.render('layouts/default', {
        title: 'Home',
        page: '/contato',
        menus: entityMenus,
        departments: entityDepartments
      });
    });
  });
};

exports.register = function(req, res, next, message, data) {
  db.Menu.findAll({
    where: {
      status: true
    },
    attributes: [ 'description', 'url' ],
    order: "position ASC"
  }).success(function(entityMenus) {
    db.Department.findAll({
      attributes: [ 'description', 'id' ],
      order: 'description ASC'
    }).success(function(entityDepartments) {
      res.render('layouts/default', {
        title: 'Home',
        page: '/cadastre-se',
        menus: entityMenus,
        data: data || {},
        message: message,
        departments: entityDepartments
      });
    });
  });
};