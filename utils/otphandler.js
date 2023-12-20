const speakeasy = require('speakeasy');
const Qrcode =  require('qrcode');
const generateCode = async()=>{
    const {base32:secret,otpauth_url}= speakeasy.generateSecret({name:'Vishal Maurya'});
    const qrCode = await Qrcode.toDataURL(otpauth_url);
    return {secret,qrCode}
}

const verifyOtp =(secret,otp)=>{
    return speakeasy.totp.verify({secret,
    token:otp,
    encoding:'base32'
});
}
module.exports = {generateCode,verifyOtp}

// const xyz ='PISSUYL3MFIW4ZDHGJDFWMD5EZWWQNSQGVHTM5DYGU5FWI2JHMZA';
//   const pass = 'PISSUYL3MFIW4ZDHGJDFWMD5EZWWQNSQGVHTM5DYGU5FWI2JHMZA'
