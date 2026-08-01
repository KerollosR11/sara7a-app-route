import mongoose, { Schema } from "mongoose";

// ASSIGNMENT 13

const messageSchema = new Schema(
    // Attributes
    {
        content: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },

    // options
    {
        timestamps: true
    }
);


const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;