const {hash,genSalt,compare} = require('bcrypt');

const generateHashpassword =  async(password)=>{
    const salt = await genSalt();
    const passwordHash = await hash(password,salt);
    console.log(password,passwordHash);
    return passwordHash
};

const verifypassword = async (password,hash)=>{
    const isverfied = await compare(password,hash);
    console.log(isverfied);
    return isverfied;
};

module.exports = {generateHashpassword,verifypassword};


