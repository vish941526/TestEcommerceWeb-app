const responseCreator = (message,status,data)=>{
    return {success:true,message,data}
}

const errorCreator = (message,status=500)=>{
    const err = new Error(message);
    err.status = status;
    err.message = message;
    throw err;


}
module.exports ={responseCreator,errorCreator};