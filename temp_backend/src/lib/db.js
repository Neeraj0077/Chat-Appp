import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://neerajsv964:6Og6psBJqIe6CNR6@cluster0.3hpltcz.mongodb.net/ChatApp?retryWrites=true&w=majority");
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.log("MongoDB connection error:", err);
    }

}