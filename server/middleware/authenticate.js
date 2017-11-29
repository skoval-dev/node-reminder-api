const {User} = require('./../models/user');

const authenticate = async (req, res, next) => {
    const token = req.header('x-auth');
    if(!token){
        return res.status(401).send({message: "You are not authorised!", success: false});
    }
    try{
        const user = await User.find_by_token(token);
        if(!user){
            throw new Error('You are not authorised!');
        }
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send({message: e, success: false});
    }
};

module.exports = {authenticate};