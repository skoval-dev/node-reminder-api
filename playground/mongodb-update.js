const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todo_app', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    //findAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5a1336ca0b0d4d2e74bf0a6d')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((res) => {
    //     console.log(res);
    // }).catch((err) => {
    //     console.log(err);
    // });

    //updateMany
    // db.collection('Todos').updateMany({
    //     completed: true
    // }, {
    //     $set: {
    //         completed: false
    //     }
    // }).then((res) => {
    //     console.log(res);
    // }).catch((err) => {
    //    console.log(err);
    // });

    //updateOne
    // db.collection('Todos').updateOne({
    //     title: 'First to do'
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((res) => {
    //     console.log(res);
    // }).catch((err) => {
    //     console.log(err);
    // })

    //Find and update user instance
    // db.collection('Users').findOneAndUpdate({
    //     location: 'Istanbul'
    // }, {
    //     $set: {
    //         name: "Mike",
    //         age: 22
    //     }
    // }, {
    //     returnOriginal: true
    // }).then((res) => {
    //     console.log(res);
    // }).catch((err) => {
    //     console.log(err);
    // });


    //Find and update user's age ($inc) and name
    // db.collection('Users').findOneAndUpdate({
    //     name: 'Mike'
    // }, {
    //     $set: {
    //         name: 'Serhii'
    //     },
    //     $inc: {
    //         age: 1
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((res) => {
    //     console.log(res);
    // }).catch((err) => {
    //     console.log(err);
    // });

    //db.close();
});