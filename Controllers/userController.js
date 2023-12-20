const userModel = require('../models/userModel');
const { generateToken, verifyToken } = require('../utils/jwtUtils');
const { generateCode, verifyOtp } = require('../utils/otphandler');
const { generateHashpassword, verifypassword } = require('../utils/passwordUtils');
const { responseCreator, errorCreator } = require('../utils/responseCreator');



const Signup = async (req, res, next) => {
    try {
    const { password,...data}= req.body;
    const passwordHash = await generateHashpassword(password);
    data.password = passwordHash;
    const {secret,qrCode}= await generateCode();
    data.secret = secret;
        const userdata = await userModel.createUser(data);
        console.log(userdata);
        console.log(qrCode);
        res.status(201);
        res.send({ success: true, message: 'Account is created successfully',data: qrCode});
        // res.send(
        //     `
        //         <h1>Two Factor Authentication setup</h1>
        //         <h2>Please scan the QRcode with Google Authenticator</h2>
        //         <img src=${qrcode} />
        //     `
        // )
    }
    catch (error) {
        next(error)
    }
};


const Login = async (req, res, next) => {
    try {
        const { username ,password} = req.body;
        const {password:passwordHash,secret, ...userData} = await userModel.findUser(username);
        console.log(password);
        console.log(userData);


        const isverfied = await verifypassword(password,passwordHash);
        console.log('password is verification',isverfied);
        if(isverfied) {
            const token = generateToken(userData);
            res.status(200);
            res.cookie('token',token,{maxAge:3600000,httpOnly:true});
            res.send(responseCreator( `${username} logged succesfully`, 200,userData));
        } 
        else{
           errorCreator('Invalid password ! Enter Correct password ', 401);
        }
    }
    catch (error) {
        next(error)
    }
};

const loginWithToken = async (req,res,next)=>{
    try{

        const {token=null}= req.cookies;
        const data = verifyToken(token);
        res.send(responseCreator('loggedin with cookies',200,data));
    }
    catch(error){
        next(error);
    }
};

const order = async(req,res,next)=>{
    const user = res.locals.user;
    const data = await userModel.getCartItems(username)
    res.send(responseCreator('ordered successfull!!!',201,user));
}

const resetPassword = async (req, res, next) => {
    try {
        const { password, username, otp } = req.body;
        const { secret } = await userModel.findUser(username);
        console.log({ secret });
        const isOTPvalid = verifyOtp(secret, otp);
        if (isOTPvalid) {
            // upadte the new password
            const passwordHash = await generateHashpassword(password);
            const userUpadteData = await userModel.updatePassword(username, passwordHash);
            if (userUpadteData.modifiedCount) {
                res.status(200);
                res.send(responseCreator(`Password reset successfully!!!`,200));
            }
        } else {
            errorCreator('Invalid OTP', 401);
        }
    } catch (error) {
        next(error)
    }
}

const logOut =(req,res,next)=>{
    res.clearCookie('token');
    res.send(responseCreator('Loggedout successfully ',201));

}


module.exports = { Signup,Login,loginWithToken,resetPassword,order,logOut}


