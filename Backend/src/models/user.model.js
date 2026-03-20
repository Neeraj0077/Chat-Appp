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
        unique: true,
        minlength: 6,
        maxlength: 50,
    },
    profilePic: {
        type: String,
        default: "",
    },
},
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema);
export default User;