const app = require("./config/app.js");
const cors = require("cors");
const express = require("express");
const userRoutes = require("./controllers/userController");
const noteRoutes = require("./controllers/noteController");
const roomRoutes = require("./controllers/roomController");

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/room", roomRoutes);
app.listen(3000, () => {
  console.log("Server is live");
});
