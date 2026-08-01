import MessageModel from "../../DB/Models/message.model.js";
import UserModel from "../../DB/Models/user.model.js";
import { BadRequestException } from "../../Utils/Response/error.response.js";
import { SuccessResponse } from "../../Utils/Response/success.response.js";

export const sendMessage = async(req, res)=>{
    const {content, receiverId} = req.body;
    let checkExistUser = await UserModel.findById(receiverId);
    if(!checkExistUser){
        NotFoundException({message: "User Not Found!"});
    };
    let newMessage = await MessageModel.insertOne({receiverId: receiverId, content: content});
    if(!newMessage){
        BadRequestException({message: "Failed to send message!"});
    };

    SuccessResponse({res, statusCode:201, message:"Message Sent Successfully!", data: newMessage});
};