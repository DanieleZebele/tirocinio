const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/dabatase")

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
	username:{
		type: String,
		required: true,
		unique: true
	},
	password:{
		type: String,
		required: true,
	},
	isLoggedIn:{
		type: Boolean,
	}
})

userSchema.pre('save', function(next) {
    let user = this;
    console.log('crypting password..')

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});



module.exports = mongoose.models.Users || mongoose.model("Users",userSchema) 