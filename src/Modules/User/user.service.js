import UserModel from "../../DB/Models/user.model.js";
import { hashData, verifyData } from "../../Middlewares/Security/encryption.js";
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from "../../Utils/Response/error.response.js";
import { SuccessResponse } from "../../Utils/Response/success.response.js";
import env from "../../Config/config.js";



export const getUserData = async(req, res)=>{
    let {authorization} = req.headers;
    let user = await UserModel.findById(req.userData);

    if(!user){
        NotFoundException({message: "User not found!"});
    }

    SuccessResponse({res, statusCode:200, message:"User fetched successfully!", data: user});
};

export const updateUser = async(req, res)=>{
    let {name, password, uniqueAccName, newPassword} = req.body;
    let userId = req.userData;
    let user = await UserModel.findById(userId);
    let newHashPassword = "";
    let fileUpload = req.file;
    console.log("line 26",fileUpload);
    let imageField = "";
    
    if(fileUpload){
        imageField = `${env.serverUri}/${fileUpload.path}`;
        console.log(imageField, "from file upload");
    }
        
    if(!user){
        NotFoundException({message: "User not found!"});
    }

    if(password){
        let comparedPW = await verifyData(password, user.password);
        if(!comparedPW){
            BadRequestException({message:"Error, Wrong Password!"});
        }
        newHashPassword = await hashData(newPassword);
    }

    let existUniqueAccName = await UserModel.findOne({uniqueAccName: uniqueAccName});
    if(existUniqueAccName){
        ConflictException({message: "This Name already exist!"});
    }

    let updateUserData = await UserModel.findByIdAndUpdate(
        {_id : userId},
        {
            $set: {
                name: name,
                password: newHashPassword,
                uniqueAccName: uniqueAccName,
                profilePicture: imageField
            }
        },
        {new: true}
    );


    SuccessResponse({res, statusCode:200, message:"User updated successfully!", data: updateUserData});
};