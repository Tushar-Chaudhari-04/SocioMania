// MVC Architecture is followed (Modal View Controller)
//Auth Controller Section

//crypto.randomBytes(64).toString("hex")

const User=require("../models/User");
const CryptoJS = require("crypto-js");
const jwt=require("jsonwebtoken");
const {success,error}=require("../utils/responseWrapper")

const signupController=async(req,res)=>{
    try {
        const {firstName,lastName,email,password}=req.body;    //Destructuring of data
        console.log("Hi Tango",req.body)
        if(!firstName || !lastName || !email || !password){
            res.send(error(400,"All feilds are mandatory..."));
        }

        const oldUser=await User.findOne({email});
        if(oldUser){
            res.send(error(409,"User already exsits.Please try with new credentials"));
        }

        console.log("newUser123");
        const newUser=new User({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:CryptoJS.AES.encrypt(                //Crypto JS used for masking password 
                password,
                process.env.SECRET_KEY
            ).toString()
        });
        console.log("newUser1",newUser);
        try {
            if(newUser){
                console.log("newUser2",newUser);
                const user=await newUser.save();
                const {password,...data}=user._doc;
                console.log("data",data);
                res.send(success(201,data));
            }
        } catch (error) {
            res.send(error(500,"Error in User Registration..."));
        }

        /*
            const hashPassword=await bcrypt.hash(password,10);   //hash method to mask password
            const user=await User.create({
                email:email,
                password:hashPassword
            })
        */

    } catch (err) {
        console.log(err);
    }
}

const loginController=async(req,res)=>{
    try {
        const {email,password,isAdmin}=req.body;    //Destructuring of data
        console.log("req.body",req.body)
        if(!email || !password){
            res.send(error(400,"All feilds are mandatory..."));
        }
        console.log("1")
        try{
            console.log("2")
            const user=await User.findOne({email});
            console.log("3")
            console.log("user",user)
            !user &&  res.send(error(401,"User is not Register...")); 

            //Crypto JS used for decrypt password in bytes 
            const bytes=CryptoJS.AES.decrypt(                
                user.password,
                process.env.SECRET_KEY
            )
            
            //Bytes to Original password conversion...    
            const originalPassword = bytes.toString(CryptoJS.enc.Utf8); 
            console.log("pass",originalPassword)
            if(user){
                if(user.email==email){
                    if(password==originalPassword){
                        const {password,...data}=user._doc;
                        const accessToken=generateAccessToken(data);
                        const refreshToken=generateRefreshToken(data);

                        //Add Refresh Token in cookies and add secure options...
                        res.cookie("refreshToken",refreshToken,{
                            httpOnly:true,
                            secure:true
                        });
                        res.send(success(200,{...data,accessToken,refreshToken}));
                    }else{
                        res.send(error(401,"Credentials are not correct...")); 
                    }
                }else{
                    res.send(error(401,"User is not Authenticated.Try after sometime...")); 
                }
            }
        }catch(err){
            res.send(error(401,"User is not Authenticated.Please Register.....")); 
        }
        
    } catch (err) {
        console.log(err);
    }
}

//Api will check refreshToken validity and generate new accessToken
//This will secure User as well as enhance user experience...
const refreshAccessTokenController=async(req,res)=>{
    //const {refreshToken}=req.body;
    console.log("refresh request",req.body.refreshToken)
    const cookies=req.cookies;
    console.log("refresh Token",cookies.refreshToken)
    if(!cookies.refreshToken){
        res.send(error(401,"Refresh Token is required in cookies")); 
    }

    const refreshToken=cookies.refreshToken;
    //const refreshToken=req.body.refreshToken;
    console.log("refresh Token 123",refreshToken)
    try {
        const verifyRefreshToken=jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECERET_KEY
        );
        
        const accessToken=generateAccessToken(verifyRefreshToken);
        console.log("new accessToken",accessToken)
        if(accessToken){
            res.send(success(200,{...verifyRefreshToken,accessToken})); 
        }
    } catch (error) {
        console.log("Error in Refresh Token ...")
        res.send(error(401,"Invalid Refresh Token")); 
    } 
}



//internal functions...
const generateAccessToken=(data)=>{
    const accessToken=jwt.sign(
        {id:data._id,isAdmin:data.isAdmin,email:data.email},
        process.env.ACCESS_TOKEN_SECERET_KEY,
        {expiresIn:"7d"}
    );
    return accessToken;
}

const generateRefreshToken=(data)=>{
    const refreshToken=jwt.sign(
        {id:data._id,isAdmin:data.isAdmin,email:data.email},
        process.env.REFRESH_TOKEN_SECERET_KEY,
        {expiresIn:"7d"}
    );
    return refreshToken;
}

const logoutController=async(req,res)=>{
    try {
        res.clearCookie("jwt",{
            httpOnly:true,
            secure:true
        })

        res.send(success(200,"User is Logout..."))
    } catch (err) {
        res.send(error(500,err.message));
    }
}

module.exports={
    signupController,
    loginController,
    refreshAccessTokenController,
    logoutController
}