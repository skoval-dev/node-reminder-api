const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todo_app', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    //deleteMany
    db.collection('Todos').deleteMany({title: 'Buy books'}).then((result) => {
        console.log(result);
    }).catch((err) => {
         console.log(err));
    }

    //deleteOne
    db.collection('Todos').deleteOne({title: 'First to do'}).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    });

    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({title: "First to do"}).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    })

    /*Delete user collection objects*/

    //deleteMany
    db.collection('Users').deleteMany({name: 'John'}).then((results) => {
        console.log(results);
    }).catch((err) => {
        console.log(err);
    });

    //deleteOne
    db.collection('Users').deleteOne({name: 'Mike'}).then((results) => {
        console.log(results);
    }).catch((err) => {
       console.llog(err);
    });

    //findAndDelete
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5a13311d40e65c2ab4b1167c')}).then((results) => {
        console.log(results);
    }).catch((err) => {
        console.log(err);
    });


    //db.close();
});