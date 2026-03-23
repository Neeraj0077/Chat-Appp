import express from "express";
import dotenv from "dotenv";
dotenv.config();

console.log("ENV TEST:", {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL ? "loaded" : "undefined",
    JWT_SECRET: process.env.JWT_SECRET ? "loaded" : "undefined",
});


import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import path from "path";
import friendRoutes from "./routes/friend.route.js";

const __dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", router);
app.use("/api/messages", messageRoute);
app.use("/api/friends", friendRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*path}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

server.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port", process.env.PORT || 3000);
    connectDB();
});