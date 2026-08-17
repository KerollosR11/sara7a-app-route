import UserModel from "../../DB/Models/user.model.js";
import { hashData, verifyData } from "../../Middlewares/Security/encryption.js";
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from "../../Utils/Response/error.response.js";
import { SuccessResponse } from "../../Utils/Response/success.response.js";
import env from "../../Config/config.js";
import { RoleEnum } from "../../Utils/enum.js";



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

export const getUserDataByUniqueAccName = async(req, res)=>{

    const {uniqueAccName} = req.params;
    let user = await UserModel.findOne({uniqueAccName: uniqueAccName});
    if(!user){
        NotFoundException({message: "User not found!"});
    }

    SuccessResponse({res, statusCode:200, message:"User fetched successfully!", data: user});

};

export const freezeAccount = async(req, res)=>{

    const {userId} = req.params; // account
    let actionUserDataId = req.userData; // from access token
    let targetUserId = userId || actionUserDataId;

    const actionUser = await UserModel.findById(actionUserDataId); // if there's userId and admin wants to freeze account

    let targetAccount = await UserModel.findById(targetUserId);
    if(!targetAccount){
        NotFoundException({message:"User not found!"});
    }

    if(targetUserId.toString() !== actionUserDataId && actionUser.role !== 1){
        // not the same user nor admin .. someone else try to freeze the account
        ForbiddenException({message: "You are not authorized to Deactivate this account"});
    }

    const updateUserData = await UserModel.findOneAndUpdate(
        {_id: targetUserId, freezedAt: {$exists: false}},
        {
            $set: {
                freezedBy: actionUser._id,
                freezedByRole: actionUser.role,
                freezedAt: new Date(),
            },
            $unset: {
                restoredBy : true,
                restoredAt : true
            }
        },
        {new: true}
    );

    SuccessResponse({res, statusCode:200, message:"User frozen successfully!", data: updateUserData});
};

export const restoreAccount = async(req, res)=>{

    const {userId} = req.params; // account
    let actionUserDataId = req.userData; // from access token
    let targetUserId = userId || actionUserDataId;

    const actionUser = await UserModel.findById(actionUserDataId); // if there's userId and admin wants to restore account

    let targetAccount = await UserModel.findById(targetUserId);
    if(!targetAccount || !targetAccount.freezedAt){
        NotFoundException({message:"User not found or Account is not Deactivated!"});
    }

    // not the owner or the admin
    if(targetUserId.toString() !== actionUserDataId && actionUser.role !== RoleEnum.admin){
        ForbiddenException({message: "You are not authorized to restore this account"});
    }

    // Admin was the role who deactivated account
    if(targetAccount.freezedByRole === RoleEnum.admin && actionUser.role !== RoleEnum.admin){
        ForbiddenException({message: "You are not authorized to restore this account only admins can restore your account ... try to contact with support team"});
    }

    const updateUserData = await UserModel.findOneAndUpdate(
        {_id: targetUserId, freezedAt: {$exists: true}},
        {
            $set: {
                restoredBy: actionUser._id,
                restoredAt: new Date(),
            },
            $unset: {
                freezedBy: true,
                freezedByRole: true,
                freezedAt: true,
            }
        },
        {new: true}
    );

    SuccessResponse({res, statusCode:200, message:"Account restored successfully!", data: updateUserData});
};

export const hardDelete = async(req, res)=>{

    const {userId} = req.params; // account
    let actionUserDataId = req.userData; // from access token
    let targetUserId = userId;

    const actionUser = await UserModel.findById(actionUserDataId); 

    let targetAccount = await UserModel.findById(targetUserId);
    if(!targetAccount){
        NotFoundException({message:"User not found"});
    }

    // not the admin
    if(actionUser.role !== RoleEnum.admin){
        ForbiddenException({message: "You are not authorized to delete this account"});
    }

    let results = await UserModel.findByIdAndDelete(targetUserId);

    SuccessResponse({res, statusCode:200, message:"Account Deleted successfully!", data: results});
};