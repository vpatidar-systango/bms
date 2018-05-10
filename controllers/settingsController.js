var mail = require('../configurations/mailing/mailComposer');
var defaultJson = require('../configurations/default.json');
var util = require('../utils/util');
var authController = require('../controllers/authController');
var userModel = require('../models/userModel');
var bcrypt = require('bcryptjs');

/**
 * 
 * @param {*Object} req 
 * @param {Object} res 
 */
module.exports.resetPasswordMail = async function (req, res) {
    try {
        var user = await authController.getUserByEmail(req.body.email);
        if (!user) {
            req.flash('error_msg', "user not valid");
            res.redirect('/reset-password');
        } else {
            var token = await util.generateToken();

            var resetUrl = `https://${req.headers.host}/setting/reset-password/${token}`;

            var mailObj = { 
                "to": req.body.email,
                "subject": defaultJson.mail.subject,
                "body": defaultJson.mail.header + "Manish \n" + defaultJson.mail.middle + "\n" + resetUrl + "\n" + defaultJson.mail.footer + "\n" + defaultJson.mail.regards
            }
            var data = await mail.sendMail(mailObj);
            console.log("done: " + data);
            //res.json({ "data: ": data, "resetUrl": resetUrl });
            //user.token = token;
            await userModel.findByIdAndUpdate(user._id, { token: token }, { upsert: true });
            res.render('reset-password', { flag: true, message: "Email has been sent to your email address, please follow the link to reset your password." });
        }
    } catch (err) {
        res.json({ "message": err })
    }
}

/**
 * 
 * @param {*Object} req 
 * @param {Object} res 
 */
module.exports.resetPassword = function (req, res) {
    if (req.params.token) {
        res.render('reset-password', { "token": req.params.token, flag: false })
    } else {
        res.render('reset-password', { flag: true });
    }
}

/**
 * 
 * @param {*Object} req 
 * @param {Object} res 
 */
module.exports.resetPasswordSubmit = async function (req, res) {
    try {
        var newPassword = req.body.password;
        var token = req.body.token;
        if (newPassword != null || undefined || "" && token != null || undefined || "") {

            newPassword = await util.encrptPassword(newPassword);

            var result = await userModel.findOneAndUpdate({ token: token }, { "password": newPassword, "token": "" });
            if (result) {
                console.log("result: " + result)
                req.flash('success_msg', 'Password has been reset. You can login with new one.');
                res.redirect('/authentication/login');
            }
        }
    } catch (err) {
        res.json({ "message": err })
    }
}

/**
 * 
 * @param {*Object} req 
 * @param {Object} res 
 */
module.exports.changePassword = async function (req, res) {
    try {
        if (req.method == 'GET') {
            res.render('change-password');
        }
        if (req.method == 'POST') {
            var oldPassword = req.body.oldPassword;
            var newPassword = req.body.newPassword;
            var userId = req._passport.session.user;

            if (oldPassword != "" || undefined || null) {

                if (newPassword != "" || undefined || null) {
                    var user = await userModel.findOne({ _id: userId });
                    if (user) {
                        let isMatch = await authController.comparePassword(oldPassword, user.password);
                        if (isMatch) {
                            newPassword = await util.encrptPassword(newPassword);
                            var updatedUser = await userModel.findByIdAndUpdate(userId, { password: newPassword });
                            req.flash("success_msg", "Your password has been updated.");
                            res.redirect('/');
                        } else {
                            req.flash("success_msg", "Old password is incorrect.");
                            res.redirect('/change-password');
                        }
                    }
                }
            }

        }
    } catch (err) {
        throw err;
    }

}