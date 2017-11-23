const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


const User_Schema = new Schema({
    email: {
        type: String,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: '{VALUE} is not a valid email value!'
        },
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required:true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

User_Schema.methods.generate_auth_token = function() {
    const User = this,
        access = 'auth',
        token = jwt.sign({_id: User._id.toHexString(), access}, 'abc123').toString();
    User.tokens.push({access, token});

    return User.save().then(() => token);
};

User_Schema.methods.toJSON = function() {
    const User = this;
    let user_object = User.toObject();
    return _.pick(user_object, ['_id', 'email']);
};

User_Schema.statics.find_by_token = function(token) {
    const User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        return Promise.reject('The provided token is incorrect!');
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

};

User_Schema.statics.find_by_credentials = function(email, password) {
    const User = this;

    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject({message: "User doesn\'t exist !", success: false});
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                   resolve(user);
                }else{
                    reject({message:(err && err.message) || "The password doesn\'t matches", success: false});
                }
            });
        });
    });
};

User_Schema.pre('save', function(next){
    const User = this;
    if(User.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(User.password, salt, (err, hash) => {
                User.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

const User = mongoose.model('User', User_Schema);

module.exports = {
  User
};