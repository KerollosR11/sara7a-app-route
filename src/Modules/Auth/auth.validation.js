import joi from "joi";
import { Types } from "mongoose";

// ASSIGNMENT 11

export const signupSchema = joi.object({
    name : joi.string().min(3).max(25).pattern(/^[a-zA-Z ]+$/).required(),
    email: joi.string().required().email(),
    password: joi.string().required(),
    uniqueAccName: joi.string().required(),
    phone: joi.string().optional()
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

export const updateSchema = joi.object({
    name : joi.string().min(3).max(25).pattern(/^[a-zA-Z ]+$/).optional(),
    password: joi.string().optional(),
    newPassword: joi.string().optional(),
    uniqueAccName: joi.string().optional(),
    phone: joi.string().optional()
});

export const ObjectIdSchema = joi.object({
    params : joi.object({
        userId: joi.string().custom((value, helper)=>{
            return (Types.ObjectId.isValid(value) || helper.message("invalid ObjectId format"))
        })
    })
});