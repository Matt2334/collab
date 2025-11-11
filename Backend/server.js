const app = require("./config/app.js");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const noteRoutes = require("./routes/notes");
const roomRoutes = require("./routes/rooms");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a room
  socket.on("join-room", (roomId) => {
    socket.join(`room-${roomId}`);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Notify members of that room
    socket.to(`room-${roomId}`).emit("user-joined", {
      userId: socket.id,
      timestamp: new Date(),
    });
  });
  socket.on("leave-room", (roomId) => {
    socket.leave(`room-${roomId}`);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });
  // Begin Note Editing
  socket.on("note-editing", ({ roomId, noteId, userName }) => {
    socket.to(`room-${roomId}`).emit("user-editing-note", {
      noteId,
      userName,
      userId: socket.id,
    });
  });

  // Stop Note Editing
  socket.on("note-editing-stopped", ({ roomId, noteId }) => {
    socket.to(`room-${roomId}`).emit("user-stopped-editing", {
      noteId,
      userId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes(io));
app.use("/api/room", roomRoutes);

server.listen(3000, () => console.log("Server is live"));
// app.listen(3000, () => {
//   console.log("Server is live");
// });
