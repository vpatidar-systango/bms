var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
var passport = require('../configurations/passport/strategiesConfig');



router.get('/auth/google',
    passport.authenticate('google', { 
        scope: "https://www.googleapis.com/auth/plus.login" 
    }));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/authentication/login'
    }));

router.get('/auth/facebook',
    passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/authentication/login'
    }));

// Register
router.get('/register', authController.registerUser);
router.post('/register', authController.registerUser);

// Login
router.get('/login',  authController.login);
router.post('/login', authController.checkValidity,
	passport.authenticate('local', { 
        successRedirect: '/', 
        failureRedirect: '/authentication/login', 
        failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

//logout
router.get('/logout', authController.logout );



module.exports = router;