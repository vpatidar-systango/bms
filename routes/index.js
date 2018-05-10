var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
var saController = require('../controllers/saController');
var indexController = require('../controllers/indexController');
var buildingModel = require('../models/buildingModel');
var middleware = require('../middlewares/index')

// Get Homepage
router.get('/', middleware.ensureAuthenticated, middleware.checkBuilding, indexController.getIndexPage);

//invitation
router.get('/invitation/:token', authController.acceptInvitation);


module.exports = router;