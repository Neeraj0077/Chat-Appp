import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app); // ← wrap express in http server

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

//used to store 
const userSocketMap = {};

io.on("connection", (socket) => {
     const userId = socket.handshake.query.userId;
     if (userId) {
         userSocketMap[userId] = socket.id;
     }
    
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        for (const [userId, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[userId];
                break;
            }
        }
        // Notify all clients about the updated online users
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };