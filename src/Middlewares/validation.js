import joi from "joi";
import { BadRequestException } from "../Utils/Response/error.response.js";

// ASSIGNMENT 11

export const validation = (schema)=>{


    return (req, res, next)=>{
        let validationData = schema.validate(req.body, {abortEarly: false});
    
        if(validationData.error){
            BadRequestException({message: "Validation Error", extra: validationData.error});
        }

        next();
    };
};
