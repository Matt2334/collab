const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/auth.js");
const {
  createRoom,
  addMembers,
  getRooms,
  deleteRoom,
} = require("../controllers/roomController");
router.post("/create", authenticateJWT, createRoom);
router.put("/rooms/:roomId/add", authenticateJWT, addMembers);
router.get("/list", authenticateJWT, getRooms);
router.delete("/:roomId/leave", authenticateJWT, deleteRoom);
module.exports = router;
