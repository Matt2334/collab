const app = require("./config/app.js");
const cors = require("cors");
const express = require("express");
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/user");
const noteRoutes = require("./routes/notes");
const roomRoutes = require("./routes/rooms");

app.use(cookieParser());
app.use(cors({origin: 'http://localhost:5173',credentials: true}));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/room", roomRoutes);
app.listen(3000, () => {
  console.log("Server is live");
});
