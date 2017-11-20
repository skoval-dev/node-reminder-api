const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todo_app', (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    /*Insert data to a collection*/
    // db.collection('Todos').insertOne({
    //     title: "First to do",
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert todo', err);
    //     }
    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     });
    /*Insert data to a collection*/
    db.collection('Users').insertOne({
        name: 'John',
        age: 22,
        location: 'London'
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert data', err);
        }
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp().toLocaleString(), undefined, 2));
    });
    db.close();
});