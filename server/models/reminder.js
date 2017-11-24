const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reminderSchema = new Schema({
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
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = {
    Reminder
};