import jwt from 'jsonwebtoken';

const jwt_secret = "neerajjwt";

export const generateToken = (userId, res) => {
    const token = jwt.sign(
        { userId: userId.toString() }, // ← wrap in plain object, convert to string
         jwt_secret,
        { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: false
    })

    return token;
}