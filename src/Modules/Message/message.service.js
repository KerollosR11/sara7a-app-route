import env from "../../Config/config.js";
import MessageModel from "../../DB/Models/message.model.js";
import UserModel from "../../DB/Models/user.model.js";
import { BadRequestException, NotFoundException } from "../../Utils/Response/error.response.js";
import { SuccessResponse } from "../../Utils/Response/success.response.js";

export const sendMessage = async(req, res)=>{
    const {content, receiverId} = req.body;
    let imageMessage = req.file;

    let checkExistUser = await UserModel.findById(receiverId);
    if(!checkExistUser){
        NotFoundException({message: "User Not Found!"});
    };

    let image = "";
    if(imageMessage){
        image = `${env.serverUri}/uploads/${imageMessage.filename}`;
    }

    let newMessage = await MessageModel.insertOne({receiverId: receiverId, content: content, image: image});
    if(!newMessage){
        BadRequestException({message: "Failed to send message!"});
    };

    SuccessResponse({res, statusCode:201, message:"Message Sent Successfully!", data: newMessage});
};

export const getMessage = async(req, res)=>{
    // for pagination
    const {page = 1, limit = 3} = req.query;
    const skip = (page - 1) * limit;

    const receiverId = req.userData;

    // to make 2 parallel processes
    const [messages, totalMessages] = await Promise.all([
        MessageModel.find({receiverId})
        .sort({createdAt : -1})
        .skip(Number(skip))
        .limit(Number(limit)),

        MessageModel.countDocuments({receiverId})
    ]);

    SuccessResponse({
        res, 
        statusCode:200, 
        message:"Messages Fetched Successfully!", 
        data: {
            messages,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalMessages / limit),
                totalMessages: totalMessages
            }
        }
    });
};

export const toggleRead = async(req, res)=>{
    const {messageId} = req.params;
    const receiverId = req.userData;

    const message = await MessageModel.findById(messageId);

    if(!message || message.receiverId.toString() !== receiverId.toString()){
        NotFoundException({message: "Message not found or Unauthorized access"})
    }

    message.isRead = !message.isRead;
    await message.save();

    SuccessResponse({res, statusCode:200, message:`Message Marked as ${message.isRead? "read": "unread"} Successfully!`,  data: message });
};

export const toggleFavorite = async(req, res)=>{
    const {messageId} = req.params;
    const receiverId = req.userData;

    const message = await MessageModel.findById(messageId);

    if(!message || message.receiverId.toString() !== receiverId.toString()){
        NotFoundException({message: "Message not found or Unauthorized access"})
    }

    message.isFavorite = !message.isFavorite;
    await message.save();

    SuccessResponse({res, statusCode:200, message:`Message Marked as ${message.isFavorite? "Favorite": "Unfavorite"} Successfully!`,  data: message });
};