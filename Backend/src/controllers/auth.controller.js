// import bcrypt from 'bcryptjs';
// import User from '../models/user.model.js';
// import { generateToken } from '../lib/utils.js';

// export const signup = async (req, res) => {
//     const { username, email, password } = req.body;
//     try {
//         usernameValidation(username);
//         EmailValidation(email);
//         PasswordValidation(password);
//     } catch (err) {
//         return res.status(400).json({ error: err.message });
//     }
// }

// async function usernameValidation(username) {
//     try {
//         const username = await User.findOne({ username });
//         if (username) {
//             res.status(400).json({
//                 message: "The username is already taken try another one"
//             });
//         }
//     } catch (err) {
//         console.log("error occured while searching username in db", err.message);
//     }
// }

// async function EmailValidation(email, username) {
//     try {
//         const email = await User.findOne({ email });
//         const hashedPassword = await PasswordValidation(password);
//         if (email) {
//             return res.json({
//                 message: "User Signed Up Already"
//             })
//         }

//         try {
//             const newUser = new User({
//                 username: username,
//                 email: email,
//                 password: hashedPassword,
//             })

//             if (newUser) {
//                 generateToken(newUser._id, res);
//             }

//             await newUser.save();

//             res.json({
//                 message: "User Created Successfully"
//             })
//         } catch (err) {
//             console.log("error in signupController", err.message);
//         }
//     } catch (err) {
//         // res.status(400).json({
//         //     message: "Error occured while searching for email in database"
//         // })
//         console.log("Error occured while searching for email in database");
//     }
// }

// async function PasswordValidation(password) {
//     try {
//         if (password.length < 6 || password.length > 50) {
//             throw new Error("Password must be between 6 and 50 characters");
//         }
//         // const salt = await bcrypt.genSalt(10);
//         const hashedPassword = bcrypt.hashSync(password, 10);
//         console.log(hashedPassword);
//     } catch (err) {
//         res.status(400).json({
//             message: "Something wrong "
//         })
//     }
//     return hashedPassword;
// }

// export const login = (req, res) => {
//     res.send("You are on now login page");
// }

// export const logout = (req, res) => {
//     res.send("You are on now logout page");
// };

// export const home = (req, res) => {
//     res.send("You are on now home page");
// }


// export default signup; logout; login; home;

import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

// ─── Validation Helpers ───────────────────────────────────────────────────────

function validateFullName(fullname) {
    if (!fullname || fullname.trim().length < 3) {
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
    console.log("Backend received:", req.body);
    // 1. Validate inputs
    try {

        validateFullName(fullname);
        validateEmail(email);
        validatePassword(password);
    } catch (err) {
        console.log("Validation error in signup controller:", err.message);
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
        generateToken(newUser._id, res);

        return res.status(201).json({ message: "User created successfully" });

    } catch (err) {
        console.error("Error in signup controller:", err.message);
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
        console.error("Error in logout controller:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// export const updateProfile = async (req, res) => {
//     try {
//         const { profilePic } = req.body;
//         const userId = req.user._id;

//         if (!profilePic) {
//             return res.status(400).json({ error: "Profile picture URL is required" });
//         }

//         const uploadResponse = await cloudinary.uploader.upload(profilePic);

//         const updatesUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");

//         res.status(200).json({
//             message: "Profile picture updated successfully",
//             user: updatesUser
//         });

//     } catch (err) {
//         console.error("Error in updateProfile controller:", err.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// auth.controller.js
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        console.log("updateProfile called, profilePic length:", profilePic?.length); // ← add this
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ error: "Profile picture is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            resource_type: "auto",
        });
        console.log("Cloudinary upload success:", uploadResponse.secure_url); // ← add this

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        ).select("-password");

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error in updateProfile:", err.message); // ← check this in terminal
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