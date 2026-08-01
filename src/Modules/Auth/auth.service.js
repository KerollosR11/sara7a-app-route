import Joi from "joi";
import UserModel from "../../DB/Models/user.model.js";
import { generateAccessToken, generateToken } from "../../Middlewares/Auth/auth.js";
import { hashData, verifyData } from "../../Middlewares/Security/encryption.js";
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from "../../Utils/Response/error.response.js";
import { SuccessResponse } from "../../Utils/Response/success.response.js"
import { createRevokeToken, redis_delete, redis_get, redis_set } from "../../DB/redis.service.js";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../../Utils/sendEmail.js";

export const userSignup = async(req, res)=>{
    let {name , email, password, uniqueAccName, phone} = req.body;

    let checkExistUser = await UserModel.findOne({email: email});

    if(checkExistUser){
        ConflictException({message: "User Already Exist!"});
    }

    let encryptPW = await hashData(password);

    let otp = Math.floor(100000 + Math.random() * 900000);
    
    let newUser = await UserModel.create({
        name: name,
        email: email,
        password : encryptPW,
        uniqueAccName : uniqueAccName,
        phone: phone
    });
    let hashedOTP = await hashData(otp.toString());
    await redis_set({key:`otp:${newUser._id}`, value: hashedOTP, ttl: 60*2});

    // ASSIGNMENT 12
    await sendEmail({
        to: newUser.email,
        subject: "Verify your account",
        html: `<h2>Hello ${newUser.name}</h2>
               <h3> Welocme to our app, kindly verify your account with OTP: ${otp}</h3>`
    });

    
    SuccessResponse({
        res, message:"User Signedup Successfully!!", statusCode:201, data: newUser
    });
};


export const userLogin = async(req, res)=>{
    let {email, password} = req.body;

    let user = await UserModel.findOne({email: email});

    if(!user){
        NotFoundException({message: "User Not Found!"});
    };

    let validPW = await verifyData(password, user.password);

    if(!validPW){
        BadRequestException({message: "Email or Password is invalid"});
    };

    let {accessToken, refreshToken} = await generateToken({userId: user._id}, req.get("host"), user.role);
    
    SuccessResponse({
        res, 
        message:"User Logged in Successfully!!", 
        statusCode:200, 
        data: {User: user, AccessToken: accessToken , RefreshToken: refreshToken }
    });
};

export const getAccessToken = async(req, res)=>{
    let {authorization} = req.headers;
    let host = req.get("host");

    let accessToken = await generateAccessToken(authorization, host);
    

    SuccessResponse({res, statusCode:200, message:"Token Generated Successfully!", data: {AccessToken:accessToken}});
};

// ASSIGNMENT 12
export const verifyAccount = async(req, res)=>{
    const {email, otp} = req.body;
    const user = await UserModel.findOne({email: email});
    if(!user){
        NotFoundException({message: "User Not Found!"});
    };

    if(user.isVerified){
        ConflictException({message:"User Already Verified!!"})
    }

    let redisOTP = await redis_get(`otp:${user._id}`);
    let compareOTP = await verifyData(otp, redisOTP);
    
    if(!compareOTP){
        BadRequestException({message: "Invalid otp, Try again later"});
    }
    user.isVerified = true;
    await user.save();
    await redis_delete(`otp:${user._id}`);
    SuccessResponse({res, statusCode:200, message:"Account verified Successfully!", data: user});
};

export const logout = async(req, res)=>{
    let userId = req.userData;
    let token = req.token;

    let redisKey = createRevokeToken({userId: userId, token: token});
    await redis_set({key: redisKey, value:1, ttl: req.decoded.iat + 30*60});

    SuccessResponse({res, statusCode:200, message:"User logged out Successfully!"});
};

// ASSIGNMENT 11
export const signupMail = async(req, res)=>{
    const token = req.body;
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
        idToken: token.idToken,
        audience: "512271774578-4vgqe37357pn0jturg271ashh4nu3imq.apps.googleusercontent.com"
    });

    const payload = await ticket.getPayload();
    if(!payload.email_verified){
        BadRequestException({message: "Your email is not verified"})
    }
    let {email, name} = payload;
    let checkExistUser = await UserModel.findOne({email: email});
    if(checkExistUser){
        ConflictException({message: "User already exist"});
    }

    try {
        let newUser = await UserModel.insertOne({name: name, email: email, provider: "google", isVerified: true});   
        SuccessResponse({res, statusCode:201, message:"Signed up with Google successfully!", data: newUser});
    } catch (error) {
        BadRequestException({message:"Something went wrong!!", extra: error.message})
    }
};

