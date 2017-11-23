const {User} = require('./../models/user');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    User.find_by_token(token).then((user) => {
        if(!user){
            return Promise.reject('You are not authorised!');
        }

        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        res.status(401).send({message: err, success: false});
    });
};

module.exports = {authenticate};