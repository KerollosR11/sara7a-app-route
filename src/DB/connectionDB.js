import mongoose from "mongoose";
import env from "../Config/config.js";

const dbConnection = env.dbConn;

export const databaseConnection = async ()=>{
    mongoose.connect(dbConnection, 
        {
            serverSelectionTimeoutMS: 5000
        }
    ).then( ()=>{
            console.log("Database Connceted Successfully!");
        }
    ).catch(
        (err)=>{
            console.log("Failed to connect with Database", err);
        }
    );
};