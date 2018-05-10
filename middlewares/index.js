var buildingModel = require('../models/buildingModel')
var userModel = require('../models/userModel')

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
 */
module.exports.ensureAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/authentication/login');
	}
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
 */
module.exports.checkBuilding = async function(req, res, next){
	let user = await userModel.findById(req._passport.session.user);
	if(user.role == 0 || 'TENANT'){
		return next();
	}
	let building = await buildingModel.findOne({owner_id: req._passport.session.user});
	if(building){
		return next();
	}else{
    return res.redirect('/building/building-details');
     
	}
}