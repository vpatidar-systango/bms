var mongoose = require('mongoose');

// Credential Schema
var UserSchema = mongoose.Schema({
	password: {
		type: String
	},
	email: {
		type: String
	},
	social_id: {
		type: String
	},
	provider: {
		type: String
	},
	token: {
		type: String
    },
    role: {
        type: String
    },
    active: {
        type: Boolean
	},
	name: {
		type: String
	},
	address: {
		type: String
	},
	contact: {
		type: String
	},
	createdby: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

