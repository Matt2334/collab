const express = require("express");
const router = express.Router();
const {
  createRoom,
  addMembers,
  getRooms,
  deleteRoom,
} = require("../controllers/roomController");
router.post("/create", createRoom);
router.put("/rooms/:roomId/add", addMembers);
router.get("/list", getRooms);
router.delete("/:roomId/leave", deleteRoom);
module.exports = router;
