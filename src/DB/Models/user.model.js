import mongoose, { Schema } from "mongoose";


const userSchema = new Schema(
    // Attributes
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: function (){
                return this.provider === "system"
            }
        },
        phone: {
            type: String
        },
        coverImages: {
            type: String
        },
        profilePicture: {
            type: String
        },
        uniqueAccName: {
            type: String,
            required: function (){
                return this.provider === "system"
            },
            unique: function (){
                return this.provider === "system"
            }
        },
        role: {
            type: Number,
            default: 0
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        provider: {
            type: String,
            enum: ["google", "system"],
            default: "system"
        }
    },

    // Options
    {
        timestamps: true
    }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;