const   {User} = require('./../../models/user');
const   {Reminder} = require('./../../models/reminder');
const   {ObjectID} = require('mongodb');
const   jwt = require('jsonwebtoken');

const user_ids = [new ObjectID, new ObjectID];

const _users = [
    {
        _id: user_ids[0],
        email: 'best_email@gmail.com',
        password: "hack_me",
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: user_ids[0].toHexString(), access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
    },
    {
        _id: user_ids[1],
        email: 'huge_email@gmail.com',
        password: "save_me_jesus",
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: user_ids[1].toHexString(), access: 'auth'}, process.env.JWT_SECRET).toString()
        }]

    }
];

const   _reminders = [
    {
        _id: new ObjectID(),
        text: 'Reminder, R-1',
        completed: true,
        completed_at: 1511300279632,
        _creator: _users[0]._id
    }, {
        _id: new ObjectID(),
        text: 'Reminder, R-2',
        completed: true,
        completed_at: 1511300279632,
        _creator: _users[1]._id
    }, {
        _id: new ObjectID(),
        text: 'Reminder, R-3',
        completed: true,
        completed_at: 1511300279632,
        _creator: _users[1]._id
    },
];


const populate_reminders = (done) => {
    Reminder.remove({}).then(() => {
        return Reminder.insertMany(_reminders);
    }).then(() => done()).catch((err) => {
        done(err);
    });
};

const populate_users = (done) => {
    User.remove({}).then(() => {
        let first_user = new User(_users[0]).save();
        let second_user = new User(_users[1]).save();

        return Promise.all([first_user, second_user])
    }).then(() => done()).catch((err) => {
        done(err);
    });
};

module.exports = {
    _reminders,
    _users,
    populate_reminders,
    populate_users
};

