import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");//$ne means not equal to the logged in user(us).
        res.status(200).json(filteredUsers);  
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;//just renaming the id to userToChatId for clarity.
        const myId = req.user._id;//logged in user id from the req object which is set by the auth middleware.
        const messages = await Message.find({
            $or: [ //$or operator to find messages where either the logged in user is the sender and the userToChatId is the receiver, or vice versa.
                { senderId: myId, receiverId: userToChatId },    
                { senderId: userToChatId, receiverId: myId }    
            ]
        });
        res.status(200).json(messages);
    } catch (err) {
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

        const receiverSocketId = getReceiverSocketId(receiverId);  

        if(receiverSocketId) {//this line is basically checking if the receiver is online by if online emit message in real time if not skipp.
            io.to(receiverSocketId).emit("newMessage", newMessage); 
        }

        res.status(200).json(newMessage); 

    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};