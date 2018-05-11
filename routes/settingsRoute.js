var express = require('express');
var router = express.Router();
var settingController = require('../controllers/settingsController');
var userController = require('../controllers/userController')
var middleware = require('../middlewares/index')

//reset password
router.get('/reset-password', settingController.resetPassword);
router.post('/reset-password', settingController.resetPasswordMail);
router.get('/reset-password/:token', settingController.resetPassword);
router.post('/reset-password-submit', settingController.resetPasswordSubmit);

//change password
router.get('/change-password', middleware.ensureAuthenticated,  settingController.changePassword);
router.post('/change-password', middleware.ensureAuthenticated, settingController.changePassword);



module.exports = router;