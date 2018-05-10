const bcrypt = require('bcryptjs');
var crypto = require("crypto");

/**
 * 
 * @param {String} password 
 */
module.exports.encrptPassword =async function(password){
    var salt = await bcrypt.genSalt(10);
    if (salt) {
        var hash = await bcrypt.hash(password, salt);
        if (hash) {
           return hash;
        }
    }
}

/**
 * 
 */
module.exports.generateToken = async function () {
    try{
    var buf =  await crypto.randomBytes(20);
            var token = buf.toString('hex');
             return token;
    }catch(err){
        return err;
    } 
}