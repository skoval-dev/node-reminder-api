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

app.post('/reminders', authenticate, async (req, res) => {
    const reminder = new Reminder({
        text: req.body.text,
        _creator: req.user._id
    });
    try{
        const result = await reminder.save();
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send(e);
    }

});

app.get('/reminders',authenticate, async (req, res) => {
    try {
        const reminders = await Reminder.find({_creator:req.user._id});
        if(reminders.length === 0){
            throw new Error('There are not available reminders');
        }
        res.status(200).send({reminders, success: true});

    } catch (e) {
        res.status(400).send({success: false, message: e.message});
    }
});

app.get('/reminders/:id', authenticate, async (req, res) => {
    let id = req.params && req.params.id;
    if(id && !ObjectID.isValid(id)) {
        return res.status(404).send({message: `The id: <${id}> is not valid!`, success: false});
    }
    try {
        const reminder = await Reminder.findOne({_id: id, _creator: req.user._id});
        if(!reminder){
            return res.status(404).send({message: `There are not found reminder by id <${id}>`, success: false});
        }
        res.status(200).send({reminder, success: true});
    } catch (e) {
        res.status(400).send({message: e.message, success: false});
    }
});

app.delete('/reminders/:id', authenticate, async (req, res) => {
    let id = req.params && req.params.id;
    if(id && !ObjectID.isValid(id)) {
        return res.status(404).send({message: `The id: <${id}> is not valid!`, success: false});
    }
    try{
        const reminder = await Reminder.findOneAndRemove({_id: id, _creator: req.user._id});
        if(!reminder){
            return res.status(404).send({message: `There are not found reminder by id <${id}>`, success: false});
        }
        res.status(200).send({reminder, success: true});
    } catch (e) {
        res.status(400).send({message: e.message, success: false});
    }
});

app.patch('/reminders/:id', authenticate, async (req, res) => {
    const id = req.params && req.params.id;
    if(id && !ObjectID.isValid(id)) {
        return res.status(404).send({message: `The id: <${id}> is not valid!`, success: false});
    }
    //Filter props from body based on provided in arr
    const body = _.pick(req.body, ['text', 'completed']);

    if(_.isBoolean(body.completed) && body.completed){
        body.completed_at = new Date().getTime();
    }else{
        body.completed = false;
        body.completed_at = -1;
    }
    try{
        const reminder = await Reminder.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true});
        if(!reminder){
            return res.status(404).send({message: `There are not found reminder by id <${id}>`, success: false});
        }
        res.status(200).send({reminder, success: true});
    } catch (e) {
        res.status(400).send({message: e.message, success: false});
    }
});

app.post('/users', async (req, res) => {
    try{
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generate_auth_token();
        res.header('x-auth', token).status(200).send(user);
    } catch (e) {
        res.status(400).send({message: e.message, success: false});
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', async (req, res) => {
    try{
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.find_by_credentials(body.email, body.password);
        const token = await user.generate_auth_token();
        res.header('x-auth', token).status(200).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.delete("/users/me/token", authenticate, async (req, res) => {
    try{
        await req.user.remove_token(req.token);
        res.status(200).send({message: "The token was deleted", success: true});
    } catch (e) {
        res.status(400).send({message: e.message, success: false});
    }
});

app.listen(port, () => {
   console.log(`Server is up, and listening on port: ${port}`);
});

module.exports = {app};