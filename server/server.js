const       express = require('express');
const   body_parser = require('body-parser');

const          {db} = require('./db/mongoose');

const    {Reminder} = require('./models/reminder');
const        {User} = require('./models/user');

const           app = express();
const          port = process.env.PORT || 3000;

app.use(body_parser.json());

app.post('/reminder', (req, res) => {
    const reminder = new Reminder({
        text: req.body.text
    });

    reminder.save().then((doc) => {
       console.log('Reminder was saved: ', doc);
       res.status(400).send(doc);
    }).catch((err) => {
        res.status(400).send(err);
        console.log('Error: ', err);
    });

});

app.listen(port, () => {
   console.log(`Server is up, and listening on port: ${port}`);
});



