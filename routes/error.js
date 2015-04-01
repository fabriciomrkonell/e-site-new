'use strict';

var db = require('../models');

exports.error = function(req, res, next, error) {
  res.json({ success: 0, message: "Favor preencher todos os campos!" });
};