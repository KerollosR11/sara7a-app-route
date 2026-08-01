import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.resolve("./src/Config/.env") });



const env = {
    port: process.env.PORT,
    mood: process.env.MOOD,
    salt: Number(process.env.SALT),
    adminSignature: process.env.ADMIN_SIGNATURE,
    userSignature: process.env.USER_SIGNATURE,
    adminRefToken : process.env.ADMIN_REFRESH_TOKEN,
    userRefToken : process.env.USER_REFRESH_TOKEN,
    dbConn : process.env.DB_CONN,
    serverUri: process.env.SERVER_URI,
    redisURL: process.env.REDIS_URL,
    googleAppPassword: process.env.GOOGLE_APP_PASSWORD,
    googleAccountEmail: process.env.GOOGLE_ACCOUNT_EMAIL,
    corsWhiteList : process.env.CORS_WHITE_LIST,
};


export default env;