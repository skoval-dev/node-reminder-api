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
    let user = this,
        access = 'auth',
        token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens.push({access, token});

    return user.save().then(() => token);
};

User_Schema.methods.toJSON = function() {
    let user = this;
    let user_object = user.toObject();
    return _.pick(user_object, ['_id', 'email']);
};

User_Schema.statics.find_by_token = function(token) {
    let user = this,
        decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        return Promise.reject('The provided token is incorrect!');
    }

    return user.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

};

User_Schema.pre('save', function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
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