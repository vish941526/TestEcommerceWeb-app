const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const cors = require('cors');
const dbconnection = require('./dbConnection');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRouter');
const cartRouter = require('./routes/cartRouter');
const requestlogger = require('./utils/requestlogger');
const errorhandler = require('./utils/errorhandler');
const path = require('path');
const PORT = process.env.PORT || 4000;
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));

app.use(requestlogger);

// app.get('/', (req, res) => {
//     res.send("server is running..... this is first server you can proced right now");
// });

app.use(express.json());
app.use(cookieParser());
// the below line is used for the routing /router means file location router means the name which you are routing
app.use('/user', userRouter);
app.use('/cart',cartRouter);

app.use('/', express.static(path.join(__dirname, 'build')));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname, '/build/index.html'))
})
// this below line is for the error handler 
app.use(errorhandler);
// for starting the server
app.listen(PORT, ()=> {
    console.log( `WelCome to vishalkart server is started at port ${PORT}`);
});