const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: (value) => {
                let email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return email_regex.test(value);
            },
            message: '{VALUE} is not a valid email value!'
        },
        required: true,
        trim: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User
};