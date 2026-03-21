import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req,res,next) =>{
    try{
    const token = req.cookies.jwt;

    if(!token){
        return res.status(401).json({ error: "Unauthorized access, token missing" });
    }

    const decoded = jwt.verify(token, "neerajjwt");

    if(!decoded){
        return res.status(401).json({ error: "Unauthorized access, invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if(!user){
        return res.status(401).json({ error: "Unauthorized access, user not found" });  
    }

    req.user = user
    next();

    }catch(err){
        res.status(500).json({ error: "Internal server error" });
    }

}