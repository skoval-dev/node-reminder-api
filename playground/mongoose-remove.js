const {db} = require('./../server/db/mongoose');
const {Reminder} = require('./../server/models/reminder');
const {ObjectID} = require('mongodb');


Reminder.remove({}).then((result) => {
    console.log(result.result);
});

Reminder.findOneAndRemove({_id: '5a149066b0eea9140c7b8290'}).then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});


Reminder.findByIdAndRemove('5a148fa49581fc2608a5c4a5').then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});

