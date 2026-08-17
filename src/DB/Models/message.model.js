import mongoose, { Schema } from "mongoose";

// ASSIGNMENT 13

const messageSchema = new Schema(
    // Attributes
    {
        content: {
            type: String,
            required: true,
            minLength: [1, "Message must be at least 1 character"],
            maxLength: [500, "Message cannot exceed 500 characters"],
            trim: true
        },
        image: {
            type: String
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        isFavorite: {
            type: Boolean,
            default: false
        },
    },

    // options
    {
        timestamps: true
    }
);

messageSchema.index({receiverId: 1});


const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;