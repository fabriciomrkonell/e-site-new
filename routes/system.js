var db = require('../models'),
    mkdirp = require('mkdirp');

exports.init = function(dir){
  createGroup(1);
  mkdirp(dir + '/public/img/stores');
  mkdirp(dir + '/public/img/banners');
  mkdirp(dir + '/public/img/products');
  mkdirp(dir + '/public/curriculos');
  mkdirp(dir + '/public/pdf');
};

function createGroup(id){
  db.Group.find({
    where: {
      id: id
    }
  }).success(function(entity) {
    if(!entity){
      db.Group.create({
        description: 'Diretor',
      }).success(function(entity) {
        createUser(entity.id);
        createPages(entity.id);
        createMenu();
        createDepartment();
        console.log("Grupo criado com sucesso!");
      });
    }
  });
}

function createUser(id){
  db.User.create({
    name: 'Fabrício',
    email: 'fabricioronchii@gmail.com',
    password: 'admin',
    GroupId: id
  }).success(function(entity) {
    console.log("Usuário criado com sucesso!");
  });
}

function createPages(group){
  db.Page.bulkCreate([
    { description: 'Cadastros', name: '', position: '1' },
    { description: 'Promoções', name: 'persistsale', position: '1.1' },
    { description: 'Produtos', name: 'persistproduct', position: '1.2' },
    { description: 'Departamentos', name: 'persistdepartment', position: '1.3' },
    { description: 'Lojas', name: 'persiststore', position: '1.4' },
    { description: 'Usuários', name: 'persistuser', position: '1.5' },
    { description: 'Páginas', name: 'persistpage', position: '1.6' },
    { description: 'Menus', name: 'persistmenu', position: '1.7' },
    { description: 'Grupos', name: 'persistgroup', position: '1.8' },
    { description: 'Emails', name: 'persistemail', position: '1.9' },
    { description: 'Consultas', name: '', position: '2' },
    { description: 'Promoções', name: 'searchsale', position: '2.1' },
    { description: 'Produtos', name: 'searchproduct', position: '2.2' },
    { description: 'Departamentos', name: 'searchdepartment', position: '2.3' },
    { description: 'Lojas', name: 'searchstore', position: '2.4' },
    { description: 'Usuários', name: 'searchuser', position: '2.5' },
    { description: 'Páginas', name: 'searchpage', position: '2.6' },
    { description: 'Menus', name: 'searchmenu', position: '2.7' },
    { description: 'Grupos', name: 'searchgroup', position: '2.8' },
    { description: 'Páginas por grupo', name: 'searchgrouppage', position: '2.9' },
    { description: 'Clientes', name: 'searchcustomer', position: '2.10' },
    { description: 'Emails', name: 'searchemail', position: '2.11' },
    { description: 'Site', name: '', position: '3' },
    { description: 'Banners', name: 'searchbanner', position: '3.1' },
    { description: 'Favoritos', name: 'searchproductstar', position: '3.2' },
    { description: 'RH', name: '', position: '4' },
    { description: 'Candidatos', name: 'searchcandidates', position: '4.1' }
  ]).then(function(){
    createGroupPage(group);
    console.log("Páginas criados com sucesso!");
  });
};

function createGroupPage(group){
  db.Page.findAll({
    attributes: [ 'id' ]
  }).success(function(entities){
    for(var i = 0; i < entities.length; i++){
      db.GroupPage.create({ GroupId: group, PageId: entities[i].id });
    };
  });
};

function createMenu(){
  db.Menu.bulkCreate([
    { description: 'Home', url: '/', position: '1', status: true },
    { description: 'Favoritos', url: '/favoritos', position: '2', status: true },
    { description: 'História', url: '/historia', position: '3', status: true },
    { description: 'Lojas', url: '/lojas', position: '4', status: true },
    { description: 'Ofertas', url: '/ofertas', position: '5', status: true },
    { description: 'Currículo', url: '/trabalhe-conosco', position: '6', status: true },
    { description: 'Contato', url: '/contato', position: '7', status: true },
    { description: 'Cadastre-se', url: '/cadastre-se', position: '8', status: true }
  ]).then(function(){
    console.log("Menus criados com sucesso!");
  });
};

function createDepartment(){
  db.Department.bulkCreate([
    { description: 'Açougue' }, { description: 'Congelados' },
    { description: 'Bebidas' }, { description: 'Frios' },
    { description: 'Bazar' }, { description: 'Higiene e Perfumaria' },
    { description: 'Hortifruti' }, { description: 'Limpeza' },
    { description: 'Roupas' }, { description: 'Leite Longa Vida' },
    { description: 'Pizza' }, { description: 'Brinquedos' },
    { description: 'Peixes' }, { description: 'Mercearia' },
    { description: 'Massas' }, { description: 'Padaria' },
    { description: 'Padaria Terceiros' }, { description: 'Pet Shop' },
    { description: 'Cervejas' }
  ]).then(function(){
    console.log("Departamentos criados com sucesso!");
  });
};