const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todo_app', (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({completed: false}).toArray().then((results) => {
    //    console.log(JSON.stringify(results, undefined, 2));
    // }).catch((err) => {
    //     console.log('Error: ', err);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //    console.log(JSON.stringify(count, undefined, 2));
    // }).catch((err) => {
    //     console.log('Error: ', err);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(JSON.stringify(count, undefined, 2));
    // }).catch((err) => {
    //     console.log('Error: ', err);
    // });

    db.collection('Users').find({name: 'John'}).toArray().then((results) => {
        console.log(JSON.stringify(results, undefined, 2));
    }).catch((err) => {
        console.log('Error: ', err);
    });

    //db.close();
});