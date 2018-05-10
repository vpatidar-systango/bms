var userModel = require('../models/userModel');
var bcrypt = require('bcryptjs');
var passport = require('../configurations/passport/strategiesConfig');
var ObjectId = require('mongodb').ObjectID;
var buildingModel = require('../models/buildingModel');
var Mail = require('../configurations/mailing/mailComposer');
var dj = require('../configurations/default.json');
var authController = require('../controllers/authController');
var util = require('../utils/util');

//register user
/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.UserDetails = async function (req, res) {
    if (req.method == 'GET') {
        // console.log("working")
        res.render('profile-details');
    }
    if (req.method == 'POST') {
        try {
            if (req.body.id != '' || req.body.username != '' || req.body.name != '' || req.body.address != '' || req.body.contact != '' || req.body.id != '') {
                var newUser = {
                    name: req.body.name,
                    username: req.body.username,
                    contact: req.body.contact,
                    address: req.body.address,
                };
                var user = await userModel.findByIdAndUpdate(req.body.id, newUser);
                if (user) {
                    req.flash('success_msg', 'You are registered and can now login');
                    res.redirect('/authentication/login');
                }
            }
        } catch (err) {
            res.send(err);
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
    res.redirect('/login');
}

/**
 * 
 * @param {String} email 
 */
module.exports.getUserByEmail = async function (email) {
    var query = { email: email };
    var user = await userModel.findOne(query);
    return user;
}

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
                name: profile.displayName,
                provider: profile.provider
            });
            data = await userObj.save();
            console.log("create data : " + data)
            return data;
        } else {
            var userObj = {
                name: profile.displayName,
                provider: profile.provider
            };
            data = await userModel.findOneAndUpdate({ "social_id": profile.id }, userObj, { upsert: true });
            console.log("update data : " + data)
            return data;
        }
    } catch (err) {
        return err;
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
        res.redirect('/login');
    }
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.deleteUser = async function (req, res) {
    try {
        userId = req.params.id
        if (userId) {
            let user = await userModel.findByIdAndRemove(userId);
            if (user) {
                let building = await buildingModel.findOneAndRemove({ owner_id: req.params.id });
                res.json({
                    'message': 'User has been deleted successfully'
                })
            }
        } else {
            res.json({
                'message': 'User not found.'
            })
        }

    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*Object} req 
 * @param {Object} res 
 */
module.exports.reInvite = async function (req, res) {
    try {
        let email = req.body.email,
            name = req.body.name,
            id = req.body.id;
        let checkUser = await userModel.findById(id);
        if (checkUser) {
            if (checkUser.email == email) {
                res.json({ 'message': 'Invitation already ahas been sent to this email address' });
                return;
            } else {
                var token = await util.generateToken();

                var inviteUrl = `https://${req.headers.host}/invitation/${token}`;

                var mailObj = {
                    "to": email,
                    "subject": dj.invitation_mail.subject,
                    "body": dj.invitation_mail.header + name + ", \n" + dj.invitation_mail.middle + "\n" + inviteUrl + "\n" + dj.invitation_mail.regards
                }

                var data = await Mail.sendMail(mailObj);
                if (data) {
                    console.log('mail sent')
                    let user = await userModel.findByIdAndUpdate(req.body.id, { email: email, name: name, token: token });
                    if (user) {
                        res.json({ "name": user.name, "email": email, "message": "Re-invitation mail has been sent to user." });
                        res.end();
                    }
                }

            }

        }
    } catch (err) {

    }
}