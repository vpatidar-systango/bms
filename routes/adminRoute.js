var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');
var middleware = require('../middlewares/index');
var userController = require('../controllers/userController')

router.post('/invite', middleware.ensureAuthenticated, adminController.inviteUser);
router.post('/re-invite',middleware.ensureAuthenticated, userController.reInvite);

module.exports = router;