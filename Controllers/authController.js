const { verifyToken } = require("../utils/jwtUtils");
const userModel =require('../models/userModel');
 module.exports = async (req,res,next) => {
    try {
        const {token=null}= req.cookies;
        const {username} =  verifyToken(token);
        const user = await userModel.findUser(username);
        console.log(user)
        res.locals.user = user;
       next();
    } catch (error) {
        next(error)
    }
};
