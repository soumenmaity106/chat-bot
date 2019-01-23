var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

// Get Dshboard
router.get('/', isAdmin, function (req, res) {
    res.render('admin/dashboard');
});

//Export
module.exports = router;

