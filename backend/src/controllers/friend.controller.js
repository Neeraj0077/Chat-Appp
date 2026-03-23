import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
 
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const myId = req.user._id;
        const me = await User.findById(myId);

        const users = await User.find({
            _id: { $ne: myId },
            fullname: { $regex: query || "", $options: "i" },
        }).select("-password");
 
        const usersWithStatus = users.map((user) => {
            let status = "none";
            if (me.friends.includes(user._id)) status = "friend";
            else if (me.friendRequestsSent.includes(user._id)) status = "sent";
            else if (me.friendRequestsReceived.includes(user._id)) status = "received";
            return { ...user._doc, status };
        });

        res.status(200).json(usersWithStatus);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
 
export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id;
        const { userId } = req.params;

        if (myId.toString() === userId)
            return res.status(400).json({ error: "Cannot send request to yourself" });

        const me = await User.findById(myId);
        const them = await User.findById(userId);

        if (!them) return res.status(404).json({ error: "User not found" });

        if (me.friends.includes(userId))
            return res.status(400).json({ error: "Already friends" });

        if (me.friendRequestsSent.includes(userId))
            return res.status(400).json({ error: "Request already sent" });
 
        await User.findByIdAndUpdate(myId, {
            $addToSet: { friendRequestsSent: userId },
        });
        await User.findByIdAndUpdate(userId, {
            $addToSet: { friendRequestsReceived: myId },
        });
 
        const receiverSocketId = getReceiverSocketId(userId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("friendRequestReceived", {
                _id: me._id,
                fullname: me.fullname,
                profilePic: me.profilePic,
            });
        }

        res.status(200).json({ message: "Friend request sent" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id;
        const { userId } = req.params;  

        const me = await User.findById(myId);

        if (!me.friendRequestsReceived.includes(userId))
            return res.status(400).json({ error: "No friend request from this user" });
 
        await User.findByIdAndUpdate(myId, {
            $addToSet: { friends: userId },
            $pull: { friendRequestsReceived: userId },
        });
        await User.findByIdAndUpdate(userId, {
            $addToSet: { friends: myId },
            $pull: { friendRequestsSent: myId },
        });
 
        const senderSocketId = getReceiverSocketId(userId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("friendRequestAccepted", {
                _id: me._id,
                fullname: me.fullname,
                profilePic: me.profilePic,
            });
        }

        res.status(200).json({ message: "Friend request accepted" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
 
export const declineFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id;
        const { userId } = req.params;

        await User.findByIdAndUpdate(myId, {
            $pull: { friendRequestsReceived: userId },
        });
        await User.findByIdAndUpdate(userId, {
            $pull: { friendRequestsSent: myId },
        });

        res.status(200).json({ message: "Friend request declined" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
 
export const cancelFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id;
        const { userId } = req.params;

        await User.findByIdAndUpdate(myId, {
            $pull: { friendRequestsSent: userId },
        });
        await User.findByIdAndUpdate(userId, {
            $pull: { friendRequestsReceived: myId },
        });

        res.status(200).json({ message: "Friend request cancelled" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
 
export const getFriendRequests = async (req, res) => {
    try {
        const me = await User.findById(req.user._id)
            .populate("friendRequestsReceived", "-password");
        res.status(200).json(me.friendRequestsReceived);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};