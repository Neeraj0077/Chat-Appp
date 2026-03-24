// import User from "../models/user.model.js";
// import Message from "../models/message.model.js";
// import cloudinary from "../lib/cloudinary.js";
// import { getReceiverSocketId } from "../lib/socket.js";
// import { io } from "../lib/socket.js";

// export const getUsersForSidebar = async (req, res) => {
//     try {
//         const loggedInUserId = req.user._id;
//         const me = await User.findById(loggedInUserId).populate("friends", "-password");

//         // For each friend, find their last message with the logged in user
//         const friendsWithLastMessage = await Promise.all(
//             me.friends.map(async (friend) => {
//                 const lastMessage = await Message.findOne({
//                     $or: [
//                         { senderId: loggedInUserId, receiverId: friend._id },
//                         { senderId: friend._id, receiverId: loggedInUserId },
//                     ],
//                 })
//                 .sort({ createdAt: -1 })
//                 .select("text image createdAt senderId");

//                 return {
//                     ...friend._doc,
//                     lastMessage: lastMessage || null,
//                 };
//             })
//         );

//         // Sort by last message time descending
//         friendsWithLastMessage.sort((a, b) => {
//             const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(0);
//             const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(0);
//             return bTime - aTime;
//         });

//         res.status(200).json(friendsWithLastMessage);
//     } catch (err) {
//         console.error("getUsersForSidebar error:", err.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// export const getMessages = async (req, res) => {
//     try {
//         const { id: userToChatId } = req.params;
//         const myId = req.user._id;
//         const messages = await Message.find({
//             $or: [
//                 { senderId: myId, receiverId: userToChatId },
//                 { senderId: userToChatId, receiverId: myId }
//             ]
//         });
//         res.status(200).json(messages);
//     } catch (err) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// export const sendMessage = async (req, res) => {
//     try {
//         const { text, image } = req.body;
//         const { id: receiverId } = req.params;
//         const senderId = req.user._id;
//         let imageUrl;

//         if (image) {
//             const uploadResponse = await cloudinary.uploader.upload(image);
//             imageUrl = uploadResponse.secure_url;
//         }

//         const newMessage = new Message({
//             senderId,
//             receiverId,
//             text,
//             image: imageUrl,
//         });

//         await newMessage.save();

//         const receiverSocketId = getReceiverSocketId(receiverId);
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit("newMessage", newMessage);
//         }

//         res.status(200).json(newMessage);
//     } catch (err) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const me = await User.findById(loggedInUserId).populate("friends", "-password");

        const friendsWithLastMessage = await Promise.all(
            me.friends.map(async (friend) => {
                const lastMessage = await Message.findOne({
                    $or: [
                        { senderId: loggedInUserId, receiverId: friend._id },
                        { senderId: friend._id, receiverId: loggedInUserId },
                    ],
                })
                .sort({ createdAt: -1 })
                .select("text image createdAt senderId status");

                return {
                    ...friend._doc,
                    lastMessage: lastMessage || null,
                };
            })
        );

        friendsWithLastMessage.sort((a, b) => {
            const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(0);
            const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(0);
            return bTime - aTime;
        });

        res.status(200).json(friendsWithLastMessage);
    } catch (err) {
        console.error("getUsersForSidebar error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });

        // Mark all messages from the other user as "seen"
        await Message.updateMany(
            { senderId: userToChatId, receiverId: myId, status: { $ne: "seen" } },
            { $set: { status: "seen" } }
        );

        // Notify the sender their messages were seen
        const senderSocketId = getReceiverSocketId(userToChatId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messagesSeen", { by: myId });
        }

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

        // If receiver is online → delivered, else → sent
        const receiverSocketId = getReceiverSocketId(receiverId);
        const status = receiverSocketId ? "delivered" : "sent";

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            status,
        });

        await newMessage.save();

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};