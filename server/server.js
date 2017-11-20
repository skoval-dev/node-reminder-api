let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let db = mongoose.createConnection('mongodb://localhost:27017/Reminder', {promiseLibrary: require('bluebird')});

db.on('open', () => {
    //Reminder model
    let Reminder = db.model('Reminder', {
        text: {
            type: String,
            required: true,
            minlength: [3, 'Text should contains at least three characters'],
            trim: true
        },
        remind: {
            type: Number,
            min: [new Date().getTime() + 1, 'Remind time should be bigger then current time']
        },
        completed: {
            type: Boolean,
            default: false
        },
        completed_at: {
            type: Number,
            default: -1
        },
        created_at: {
            type: Number,
            default: new Date().getTime()
        }
    });

    //Reminder instance
    let reminder = new Reminder({
        text: "Cook dinner",
        remind: ((hours) => {
            return new Date().getTime() + (hours*60*60*1000);
        })(2),
        completed_at: -1
    });

    reminder.save().then((doc) => {
        console.log('Saved reminder:', doc);
    }).catch((err) => {
        console.log('Unable to save data: ', err.message);
    });

    //Reminder instance
    let other_reminder = new Reminder({
        text: "Buy book",
        remind: ((hours) => {
            return new Date().getTime() + (hours*60*60*1000);
        })(1),
        completed: true,
        created_at: new Date().getTime(),
        completed_at: new Date().getTime()
    });

    //Reminder instance
    other_reminder.save().then((doc) => {
        console.log('Saved reminder:' , JSON.stringify(doc, undefined, 2));
    }).catch((err) => {
        console.log('Unable to save data: ', err.message);
    });

    //Reminder instance
    let empty_reminder = new Reminder({
        text: 'a',
        remind: new Date().getTime() + (2*60*60*1000)
    });

    empty_reminder.save().then((doc) => {
        console.log('Saved reminder:' , JSON.stringify(doc, undefined, 2));
    }).catch((err) => {
        console.log('Unable to save data: ', err.message);
    });

    //User model
    let User = db.model('User', {
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

    //User instance
    let user = new User({email: 'katia@gmail.com'});

    user.save().then((doc) => {
        console.log('User was saved', doc);
    }).catch((err) => {
        console.log('Unable to save user: ', err.message)
    });

});


