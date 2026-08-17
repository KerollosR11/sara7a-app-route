import { hashData } from "../Middlewares/Security/encryption.js";

export const generateOTP = ()=>{
    let otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
};

export const hashOTP = async (otp)=>{
    let hashedOTP = await hashData(otp.toString());
    return hashedOTP;
};