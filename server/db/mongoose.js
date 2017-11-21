const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Reminder', {useMongoClient: true});

module.exports = {
  db: mongoose
};
