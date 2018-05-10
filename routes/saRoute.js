var express = require('express');
var router = express.Router();
var saController = require('../controllers/saController')
var middleware = require('../middlewares/index')

router.post('/invite', middleware.ensureAuthenticated, saController.inviteUser);

router.post('/change-status', middleware.ensureAuthenticated, saController.changeStatus);



module.exports = router;