const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const _ = require('lodash');


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

User_Schema.set('toObject', { virtuals: true });

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

const User = mongoose.model('User', User_Schema);

module.exports = {
  User
};