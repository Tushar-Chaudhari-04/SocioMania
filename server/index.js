//Packages requried for BackEnd
const express=require("express");
const dbConnect=require("./dbConnect");
const dotenv=require("dotenv").config();
const cors = require('cors');
const morgan=require('morgan');
const cookieParser=require('cookie-parser');

//Auth Router  
const authRouter=require("./routers/authRouter");
const postsRouter=require("./routers/postsRouter");
const userRouter=require("./routers/userRouter");

//App initialization
const app=express();                                

//MongoDB Database Connection
//async await --> take time please wait
dbConnect();                                            

//app is host on PORT || 4001
app.listen(process.env.PORT || 4001,(req,res)=>{    
    console.log("Server is Working");
});

//App using middlewares
//Cors used for body parser
app.use(cors({
   credential:true,
   origin:"http://localhost:3000"
}));                                
app.use(express.json());                       //Express providing for json by default 
app.use(morgan('common'));                     //Console Log Apis 
app.use(cookieParser());                       //Adding refreshToken to Cookies


//Routers used in app 
app.use("/auth",authRouter);                   //Authentication Router
app.use("/posts",postsRouter);
app.use("/user",userRouter);

app.get("/",(req,res)=>{
    res.status(200).send("Server is Live");
});