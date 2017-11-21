const {db} = require('./../server/db/mongoose');
const {Reminder} = require('./../server/models/reminder');
const {ObjectID} = require('mongodb');
let id = "5a1448984f758026180477ac";

if(!ObjectID.isValid(id)){
	console.log('ID not valid');
}

//Returns array of element(s) or empty array.
Reminder.find({
	_id: id
}).then((reminders) => {
	if(reminders.length === 0){
		throw new Error('Id not found');
	}
	console.log('Reminders: ', reminders);
}).catch((err) => {
	if(err) console.log(err.message);
});

//Returns single object or null.
Reminder.findOne({
	_id: id
}).then((reminder) => {
	if(!reminder){
		throw new Error('Id not found');
	}
	console.log('Reminder: ', reminder);
}).catch((err) => {
	if(err) console.log(err.message);
});

//Returns Object by ID or null
Reminder.findById(id).then((reminder) => {
	if(!reminder){
		throw new Error('Id not found');
	}
	console.log('Reminder: ', reminder );
}).catch((err) => {
	if(err) console.log(err.message);
});