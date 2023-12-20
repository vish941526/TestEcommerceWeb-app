const {sign,verify} = require('jsonwebtoken');
const { errorCreator } = require('./responseCreator');
const SECRET_KEY = process.env.SECRET_KEY ;

const generateToken =(data,time='1h')=>{
    const {cart,...userData}= data;
const token= sign(userData,SECRET_KEY,{expiresIn:time});
// console.log(token)
return token
};

const verifyToken =(token)=>{
    if(!token){
        errorCreator('Session is expired login to continue',401);
    }
    const data = verify(token,SECRET_KEY)
    return data;  
};

module.exports = {generateToken,verifyToken}