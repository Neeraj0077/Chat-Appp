import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js"; // ← app and server come from here
import path from 'path'

dotenv.config();
const _dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", router);
app.use("/api/messages", messageRoute); // ← only once, remove duplicate

const isProduction = "production";

if(isProduction){
    app.use(express.static(path.join(_dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(_dirname, "..frontend/dist/index.html"));
    });
}

server.listen(3000, () => {
    console.log("Server running on port 3000");
    connectDB();
});