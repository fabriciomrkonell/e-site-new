var db = require('../models');

exports.persist = function(req, res, next) {
  db.GroupPage.find({
    where: {
      PageId: req.body.PageId,
      GroupId: req.body.GroupId
    }
  }).success(function(entityGroupPage) {
    if(entityGroupPage){
      entityGroupPage.destroy().success(function() {
        res.json({ success: 1 });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }else{
      db.GroupPage.create(req.body).success(function() {
        res.json({ success: 1 });
      }).error(function(err){
        error.error(req, res, next, err);
      });
    }
  });
};

exports.viewGroupPage = function(req, res, next) {
  var _return = {};
  db.Group.findAll({
    attributes: ['id', 'description']
  }).success(function(entityGroups) {
    _return.Groups = entityGroups;
    db.Page.findAll({
      attributes: ['id', 'description']
    }).success(function(entityPages) {
      _return.Pages = entityPages;
      db.GroupPage.findAll({
        attributes: ['id', 'GroupId', 'PageId']
      }).success(function(entityGroupPages) {
        _return.GroupPages = entityGroupPages;
        res.json({ success: 1, data: _return });
      });
    });
  })
};