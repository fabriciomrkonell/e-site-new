'use strict';

var express         = require('express')
  , app             = express()
  , cors            = require('cors')
  , http            = require('http').Server(app)
  , bodyParser      = require('body-parser')
  , errorHandler    = require('errorhandler')
  , methodOverride  = require('method-override')
  , path            = require('path')
  , db              = require('./models')
  , passport        = require('passport')
  , flash           = require('connect-flash')
  , LocalStrategy   = require('passport-local').Strategy
  , swig            = require('swig')
  , route_passport  = require('./routes/passport')
  , user            = require('./routes/user')
  , login           = require('./routes/login')
  , sale            = require('./routes/sale')
  , product         = require('./routes/product')
  , department      = require('./routes/department')
  , store           = require('./routes/store')
  , banner          = require('./routes/banner')
  , customer        = require('./routes/customer')
  , candidates      = require('./routes/candidates')
  , menu            = require('./routes/menu')
  , page            = require('./routes/page')
  , email           = require('./routes/email')
  , feature         = require('./routes/feature')
  , site            = require('./routes/site')
  , grouppage       = require('./routes/grouppage')
  , system          = require('./routes/system')
  , group           = require('./routes/group')
  , siteRoutes      = require('./configs/site');

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

app.configure(function() {
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'new-holand-project' }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');
app.set('view cache', false);
swig.setDefaults({ cache: false });

function isAuthenticatedPage(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.send({ success: 2, message: 'Falha na autenticação!' });
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/admin');
};

app.get('*', function(req, res, next){
  db.Menu.find({
    attributes: [ 'status' ],
    where: {
      url: req.path
    }
  }).success(function(entity) {
    if(entity){
      if(entity.status == true){
        next();
      }else{
        res.redirect('/');
      }
    }else{
      next();
    }
  });
});

// Site
app.get('/', siteRoutes.index);
app.get('/favoritos', siteRoutes.stars);
app.get('/historia', siteRoutes.history);
app.get('/lojas', siteRoutes.stores);
app.get('/ofertas', siteRoutes.sales);
app.get('/contato', siteRoutes.contact);
app.get('/cadastre-se', function(req, res, next){
  siteRoutes.register(req, res, next, null, {});
});
app.get('/trabalhe-conosco', function(req, res, next){
  siteRoutes.workWithUs(req, res, next, null);
});
app.get('/site/favoritos', site.salesstars);
app.get('/site/favoritos/pdf', function(req, res, next){
  site.createPDF(req, res, next, __dirname);
});
app.post('/api/contact', site.enviar)
app.post('/api/star/produto/:id', site.star)
app.post('/trabalhe-conosco', function(req, res, next){
  candidates.persist(req, res, next, __dirname);
});
app.post('/cadastre-se', function(req, res, next){
  customer.persist(req, res, next, __dirname);
});
app.post('/api/recover-password', site.recoverPassword);

// Site - Admin
app.get('/admin', function(req, res, next){
  res.render('layouts/index');
});
app.get('/admin/home', isAuthenticated, function(req, res, next){
  var _return = [],
      count = 0;
  for(var i = 0; i < req.user.dataValues.Pages.length; i++){
    if(req.user.dataValues.Pages[i].Page){
      if(req.user.dataValues.Pages[i].Page.position.split(".").length == 1){
        _return.push({ description: req.user.dataValues.Pages[i].Page.dataValues.description, child: [] });
          count = _return.length;
      }else{
        if(_return[count - 1]){
          _return[count - 1].child.push({ description: req.user.dataValues.Pages[i].Page.description, name: req.user.dataValues.Pages[i].Page.name });
        }else{
          _return.push({ description: 'Sem descrição', child: [] });
          count = _return.length;
          _return[count - 1].child.push({ description: req.user.dataValues.Pages[i].Page.description, name: req.user.dataValues.Pages[i].Page.name });
        }
      }
    }
  };
  res.render('layouts/home', {
    menu: _return
  });
});
app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/admin',
    failureFlash: true
  }), function(req, res, next) {
    res.json({ success: 1})
});
app.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/admin');
});

// Passport
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  route_passport.findById(id, function (err, user) {
    if(user){
      route_passport.getPages(user.GroupId, function (err, pages) {
        user.dataValues.Pages = pages;
        done(err, user);
      });
    }else{
      done(err, user);
    }
  });
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      route_passport.findByEmail(username, password, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user == null) {
          return done(null, null);
        }
        return done(null, user);
      })
    });
  }
));

// Util
app.get('/view/:view', isAuthenticatedPage, function(req, res, next){
  res.sendfile('site/view/' + req.param('view') + '.html');
});
app.get('/js/:js', isAuthenticatedPage, function(req, res, next){
  res.sendfile('site/js/' + req.param('js') + '.js');
});

// Group
app.get('/api/group', isAuthenticatedPage, group.getAll);
app.get('/api/group/:id', isAuthenticatedPage, group.getById);
app.post('/api/group', isAuthenticatedPage, group.persist);
app.delete('/api/group/:id', isAuthenticatedPage, group.excluir);

// GroupPage
app.post('/api/grouppage', isAuthenticatedPage, grouppage.persist);
app.get('/api/view/grouppage', isAuthenticatedPage, grouppage.viewGroupPage);

// Menu
app.get('/api/menu', isAuthenticatedPage, menu.getAll);
app.get('/api/menu/:id', isAuthenticatedPage, menu.getById);
app.post('/api/menu', isAuthenticatedPage, menu.persist);
app.delete('/api/menu/:id', isAuthenticatedPage, menu.excluir);

// Page
app.get('/api/page', isAuthenticatedPage, page.getAll);
app.get('/api/page/:id', isAuthenticatedPage, page.getById);
app.post('/api/page', isAuthenticatedPage, page.persist);
app.delete('/api/page/:id', isAuthenticatedPage, page.excluir);

// Email
app.get('/api/email', isAuthenticatedPage, email.getAll);
app.get('/api/email/:id', isAuthenticatedPage, email.getById);
app.post('/api/email', isAuthenticatedPage, email.persist);
app.delete('/api/email/:id', isAuthenticatedPage, email.excluir);

// User
app.get('/api/user', isAuthenticatedPage, user.getAll);
app.get('/api/user-me', isAuthenticatedPage, user.getUserMe)
app.get('/api/user/:id', isAuthenticatedPage, user.getById);
app.get('/api/user-pages', isAuthenticatedPage, user.getPages);
app.get('/api/view/persistuser', isAuthenticatedPage, user.viewPersistUser);
app.post('/api/user', isAuthenticatedPage, user.persist);
app.post('/api/user-password', isAuthenticatedPage, user.setPassword);

// Store
app.get('/api/store', isAuthenticatedPage, store.getAll);
app.get('/api/store/:id', isAuthenticatedPage, store.getById);
app.get('/api/store-picture/:id', isAuthenticatedPage, store.getPicturesById);
app.post('/api/store', isAuthenticatedPage, store.persist);
app.post('/api/store-picture1/:id', isAuthenticatedPage, function(req, res, next){
  store.setPicture(req, res, next, __dirname, 'picture1');
});
app.post('/api/store-picture2/:id', isAuthenticatedPage, function(req, res, next){
  store.setPicture(req, res, next, __dirname, 'picture2');
});
app.post('/api/store-picture3/:id', isAuthenticatedPage, function(req, res, next){
  store.setPicture(req, res, next, __dirname, 'picture3');
});
app.post('/api/store-picture4/:id', isAuthenticatedPage, function(req, res, next){
  store.setPicture(req, res, next, __dirname, 'picture4');
});

// Department
app.get('/api/department', isAuthenticatedPage, department.getAll);
app.get('/api/department/:id', isAuthenticatedPage, department.getById);
app.post('/api/department', isAuthenticatedPage, department.persist);

// Customer
app.get('/api/customer', isAuthenticatedPage, customer.getAll);
app.delete('/api/customer/:id', isAuthenticatedPage, customer.excluir);

// Candidates
app.get('/api/curriculo', isAuthenticatedPage, candidates.getAll);
app.get('/api/curriculo/pdf/:id', isAuthenticatedPage, candidates.createPDF);
app.get('/api/curriculo/documento/:id', isAuthenticatedPage, function(req, res, next){
  candidates.createDocumento(req, res, next, __dirname);
});
app.delete('/api/curriculo/:id', isAuthenticatedPage, candidates.excluir);

// Banner
app.get('/api/banner', isAuthenticatedPage, banner.getAll);
app.post('/api/banner', isAuthenticatedPage, banner.persist);
app.post('/api/banner-picture/:id', isAuthenticatedPage, function(req, res, next){
  banner.setPicture(req, res, next, __dirname);
});
app.delete('/api/banner/:id', isAuthenticatedPage, banner.excluir);

// Sale
app.get('/api/sale', isAuthenticatedPage, sale.getAll);
app.get('/api/sale/:id', isAuthenticatedPage, sale.getById);
app.get('/api/sale-all/:id', isAuthenticatedPage, sale.getAllById);
app.post('/api/sale', isAuthenticatedPage, sale.persist);
app.post('/api/sale-product', isAuthenticated, sale.persistProduct)
app.post('/api/sale-excel/:id', isAuthenticatedPage, sale.persistExcel)
app.delete('/api/sale/:id', isAuthenticatedPage, sale.excluir);
app.delete('/api/sale-product/:id', isAuthenticatedPage, sale.excluirProduct);

// Feature
app.get('/api/feature/:id', isAuthenticatedPage, feature.getAll);
app.post('/api/feature', isAuthenticatedPage, feature.persist);
app.delete('/api/feature/:id', isAuthenticatedPage, feature.excluir);

// Product
app.get('/api/product', isAuthenticatedPage, product.getAll);
app.get('/api/product/:id', isAuthenticatedPage, product.getById);
app.get('/api/product-autocomplete/:exp', isAuthenticatedPage, product.autocomplete)
app.get('/api/product-autocomplete-nostar/:exp', isAuthenticatedPage, product.autocompleteNoStar)
app.get('/api/product-star', isAuthenticatedPage, product.getAllByStar);
app.get('/api/view/persistproduct', isAuthenticatedPage, product.viewPersistProduct);
app.get('/api/product-picture/:id', isAuthenticatedPage, product.getPicturesById);
app.post('/api/product', isAuthenticatedPage, product.persist)
app.post('/api/product-star/:id', isAuthenticatedPage, product.persistStar)
app.post('/api/product-picture/:id', isAuthenticatedPage, function(req, res, next){
  product.setPicture(req, res, next, __dirname);
});
app.post('/api/product-picture1/:id', isAuthenticatedPage, function(req, res, next){
  product.setPicture(req, res, next, __dirname, 'picture1');
});
app.post('/api/product-picture2/:id', isAuthenticatedPage, function(req, res, next){
  product.setPicture(req, res, next, __dirname, 'picture2');
});
app.post('/api/product-picture3/:id', isAuthenticatedPage, function(req, res, next){
  product.setPicture(req, res, next, __dirname, 'picture3');
});
app.post('/api/product-picture4/:id', isAuthenticatedPage, function(req, res, next){
  product.setPicture(req, res, next, __dirname, 'picture4');
});
app.delete('/api/product/:id', isAuthenticatedPage, product.excluir);

db.sequelize.sync({ force: false }).complete(function(err) {
  if(err){
    throw err;
  }else{
    system.init(__dirname);
    http.listen(app.get('port'), function(){
      console.log('NodeJS em ' + app.get('port'));
    });
  }
});