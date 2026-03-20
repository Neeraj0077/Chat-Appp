import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"; // ← was missing
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js"; // ← import io to emit messages
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers); // ← return array directly, not { users: }
    } catch (err) {
        console.log("Error in getUsersForSidebar:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },   // ← receiverId not receiver
                { senderId: userToChatId, receiverId: myId }    // ← receiverId not receiver
            ]
        });
        res.status(200).json(messages); // ← return array directly, not { messages }
    } catch (err) {
        console.log("Error in getMessages:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId); // ← implement this function to get receiver's socket ID  

        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage); // ← emit the new message to the receiver
        }

        res.status(200).json(newMessage); // ← return message directly, not { message, newMessage }

    } catch (err) {
        console.log("Error in sendMessage Controller:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};