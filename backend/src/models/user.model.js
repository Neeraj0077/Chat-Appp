import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        minlength: 6,
        maxlength: 50,
    },
    profilePic: {
        type: String,
        default: "",
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    friendRequestsSent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    friendRequestsReceived: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
},
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema);
export default User;