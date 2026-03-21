
// export default signup; logout; login; home;

import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

// ─── Validation Helpers ───────────────────────────────────────────────────────

function validateFullName(fullname) {
    if (!fullname || fullname.trim().length < 3) { //.trim() to remove starting and ending spaces 
        throw new Error("Full name must be at least 3 characters");
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        throw new Error("Invalid email address");
    }
}

function validatePassword(password) {
    if (!password || password.length < 6 || password.length > 50) {
        throw new Error("Password must be between 6 and 50 characters");
    }
}

// ─── Controllers ─────────────────────────────────────────────────────────────

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    // 1. Validate inputs
    try {
        validateFullName(fullname);
        validateEmail(email);
        validatePassword(password);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }

    try {
        // // 2. Check if username is taken
        // const existingUsername = await User.findOne({ username });
        // if (existingUsername) {
        //     return res.status(400).json({ error: "Username is already taken" });
        // }

        // 3. Check if email is already registered
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create and save user
        const newUser = new User({
            email,
            fullname,
            password: hashedPassword,
        });

        await newUser.save();

        // 6. Generate token
        generateToken(newUser._id, res);//here we are passing the res object to set the cookie in the response.

        return res.status(201).json({ message: "User created successfully" });

    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isPassMatch = await bcrypt.compare(password, user.password);

        if (!isPassMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        generateToken(user._id, res);
        res.status(200).json({
            message: "Logged in successfully",
            _id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            profilePic: user.profilePic
        }
        );

    } catch (err) {
        console.error("Error in login controller:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ error: "Profile picture is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            resource_type: "auto",
        })

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true } //by default mongoose returns the old document before update, setting new to true makes it return the new updated docuemnt.
        ).select("-password");//-(minus)password : simply means exclude the password and return all other fields.

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user); // ← return user directly
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const home = (req, res) => {
    res.send("You are on now home page");
};