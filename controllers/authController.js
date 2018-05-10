var bcrypt = require('bcryptjs');
var passport = require('../configurations/passport/strategiesConfig');
var util = require('../utils/util');
var dj = require('../configurations/default.json');
var userModel = require('../models/userModel');


//register user
/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.registerUser = async function (req, res) {
    if (req.method == 'GET') {
        res.render('register', { userId: req.params.id });
    }
    if (req.method == 'POST') {
        try {
            if (req.body.password != '' && req.body.email != '') {
                if (req.body.token != '' || undefined || null) {
                    var encPass = await util.encrptPassword(req.body.password);
                    let user = await userModel.findOneAndUpdate({ token: req.body.token }, { password: encPass, token: '', active: true });
                    if (user) {
                        res.render('profile-details', { userId: user.id, name: user.name });
                    }
                }
                else {
                    var user = await getUserByEmail(req.body.email);
                    if (user) {
                        req.flash('success_msg', 'User already exists');
                        res.redirect('/authentication/register');
                    } else {
                        var newUserAuth = new userModel({
                            email: req.body.email,
                            role: dj.role.ADMIN,
                            active: true
                        });

                        var salt = await bcrypt.genSalt(10)
                        if (salt) {
                            var hash = await bcrypt.hash(req.body.password, salt)
                            if (hash) {
                                newUserAuth.password = hash;
                                var user = await newUserAuth.save()
                                if (user) {
                                    // req.flash('success_msg', 'You are registered and can now login');
                                    // res.redirect(`/user/profile-details/${user.id}`);
                                    res.render('profile-details', { "userId": user.id });
                                } else {
                                    req.flash('success_msg', 'Something went wrong');
                                    res.redirect('/authentication/register');
                                }

                            }
                        }
                    }
                }


            }
        } catch (err) {
            throw err;
        }
    }
}

//login 
/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.login = function (req, res) {
    if (req.method == 'GET') {
        res.render('login');
    }
    if (req.method == 'POST') {

    }
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.logout = function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/authentication/login');
}


/**
 * 
 * @param {String} username 
 */
module.exports.getUserByUsername1 =async function(username){
    try{
        var query = { username: username };
        let user = await userModel.findOne(query)
        return user;
    }catch(err){
        return err;
    }
}

/**
 * 
 * @param {String} id 
 */
module.exports.getUserById = async function(id){
    try{
        let user = await userModel.findById(id)
        return user;
    }catch(err){
        return err;
    }
}

/**
 * 
 * @param {String} candidatePassword 
 * @param {String} hash 
 */
module.exports.comparePassword = async function (candidatePassword, hash) {
    try {
        var isMatch = await bcrypt.compare(candidatePassword, hash)
        if (isMatch) return isMatch;
        else return false;
    } catch (err) {
        return err;
    }
}


/**
 * 
 * @param {String} email 
 */
var getUserByEmail = async function (email) {
    var query = { email: email };
    var user = await userModel.findOne(query);
    return user;
}
exports.getUserByEmail = getUserByEmail;

/**
 * 
 * @param {Object} profile 
 */
module.exports.findOrCreate = async function (profile) {
    try {
        var data = await userModel.findOne({ "social_id": profile.id });
        if (!data) {
            var userObj = new userModel({
                social_id: profile.id,
                provider: profile.provider,
                role: dj.role.ADMIN,
                name: profile.displayName,
                active: true
            });
            data = await userObj.save();
            console.log("create data : " + data)
            return data;

        } else {
            // var userObj ={

            //     provider: profile.provider
            // };
            // data = await userModel.findOneAndUpdate({ "social_id": profile.id }, userObj, {upsert: true});
            // console.log("update data : "+data)
            return data;
        }
    } catch (err) {
        return err;
    }
}

//accept invitation
/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.acceptInvitation = async function (req, res) {
    try {
        if (req.method == 'GET') {
            var usertoken = req.params.token;
            if (usertoken != "")
                var user = await userModel.findOne({ token: usertoken });
            if (user) {
                res.render('register', { email: user.email, token: usertoken });
            }
        }
    } catch (err) {
        throw err;
    }
}

//authenticate user
/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
 */
module.exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/authentication/login');
    }
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
 */

module.exports.checkValidity = async function (req, res, next) {
    let email = req.body.email;
    let user = await userModel.findOne({ email: email });
    if (user) {
        if (user.active === true) {
            return next();
        }
        else {
            req.flash('error_msg', 'Your account has been suspended by Admin');
            res.redirect('/authentication/login')
        }
    }
    else return next();
}