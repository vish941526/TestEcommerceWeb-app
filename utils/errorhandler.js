const errorhandler = (err,req,res,next)=>{
    console.log(err.message)
    const { message ,status =500}=err;
    res.status(status)
    if(err.code === 11000){
        err.message ='user already exists'
    }
   
    res.send({success:false,message:err.message});
}
module.exports = errorhandler;