import bcrypt from "bcrypt";
import env from "../../Config/config.js";

export const hashData = async (data)=>{
    let encryptedData = await bcrypt.hash(data, env.salt);
    return encryptedData;
};

export const verifyData = async (plainText, cypherText)=>{
    let isValid = await bcrypt.compare(plainText, cypherText);
    return isValid;
};