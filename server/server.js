require('./config/config');

const _              = require('lodash');
const       express  = require('express');
const   body_parser  = require('body-parser');

const          {db}  = require('./db/mongoose');
const    {ObjectID}  = require('mongodb');
const    {Reminder}  = require('./models/reminder');
const        {User}  = require('./models/user');
const {authenticate} = require('./middleware/authenticate');
const           app  = express();
const          port  = process.env.PORT;
const         bcrypt = require('bcryptjs');

app.use(body_parser.json());

app.post('/reminders', authenticate, (req, res) => {
    const reminder = new Reminder({
        text: req.body.text,
        _creator: req.user._id
    });

    reminder.save().then((doc) => {
       res.status(200).send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    });

});

app.get('/reminders',authenticate, (req, res) => {
	Reminder.find({_creator:req.user._id}).then((reminders) => {
		if(reminders.length === 0){
			throw new Error('There are not available reminders')
		}
		res.status(200).send({reminders, success: true});
	}).catch((err) => {
		res.status(400).send({success: false, message: err.message});
	});
});

app.get('/reminders/:id', authenticate, (req, res) => {
    let id = req.params && req.params.id;
    if(id && !ObjectID.isValid(id)) {
        return res.status(404).send({message: `The id: <${id}> is not valid!`, success: false})
    }
    Reminder.findOne({_id: id, _creator: req.user._id}).then((reminder) => {
        if(!reminder){
            return res.status(404).send({message: `There are not found reminder by id <${id}>`, success: false});
        }
        res.status(200).send({reminder, success: true});
    }).catch((err) => {
        res.status(400).send({message: err.message, success: false});
    });
});

app.delete('/reminders/:id', authenticate, (req, res) => {
    let id = req.params && req.params.id;
    if(id && !ObjectID.isValid(id)) {
        return res.status(404).send({message: `The id: <${id}> is not valid!`, success: false})
    }
    Reminder.findOneAndRemove({_id: id, _creator: req.user._id}).then((reminder) => {
        if(!reminder){
            return res.status(404).send({message: `There are not found reminder by id <${id}>`, success: false});
        }
        res.status(200).send({reminder, success: true});
    }).catch((err) => {
        res.status(400).send({message: err.message, success: false});
    });
});

app.patch('/reminders/:id', authenticate, (req, res) => {
    let id = req.params && req.params.id;
    if(id && !ObjectID.isValid(id)) {
        return res.status(404).send({message: `The id: <${id}> is not valid!`, success: false})
    }
    //Filter props from body based on provided in arr
    let body = _.pick(req.body, ['text', 'completed']);

    if(_.isBoolean(body.completed) && body.completed){
        body.completed_at = new Date().getTime()
    }else{
        body.completed = false;
        body.completed_at = -1;
    }

    Reminder.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((reminder) => {
        if(!reminder){
            return res.status(404).send({message: `There are not found reminder by id <${id}>`, success: false});
        }
        res.status(200).send({reminder, success: true});
    }).catch((err) => {
        res.status(400).send({message: err.message, success: false});
    });
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);
    user.save().then(() => {
        return user.generate_auth_token();
    }).then((token) => {
        res.header('x-auth', token).status(200).send(user);
    }).catch((err) => {
        res.status(400).send({message: err.message, success: false});
    })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    User.find_by_credentials(body.email, body.password).then((user) => {
        user.generate_auth_token().then((token) => {
            res.header('x-auth', token).status(200).send(user);
        });

    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.delete("/users/me/token", authenticate, (req, res) => {
    req.user.remove_token(req.token).then(() => {
        res.status(200).send({message: "The token was deleted", success: true})
    }).catch((err) => {
        res.status(400).send({message: err.message, success: false});
    });
});

app.listen(port, () => {
   console.log(`Server is up, and listening on port: ${port}`);
});

module.exports = {app};


