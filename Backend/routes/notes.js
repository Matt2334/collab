const express = require("express");
const authenticateJWT = require("../middleware/auth.js");
module.exports = (io) => {
  const router = express.Router();
  const {
    createNote,
    getNotes,
    getIndividual,
    updateNote,
    deleteNote,
  } = require("../controllers/noteController");
  // need to add auth: authenticateJWT

  // allow controller functions to use io (socket.io connection)
  router.use((req, res, next) => {
    req.io = io;
    next();
  });
  router.post("/:roomId/notes", authenticateJWT, createNote);
  router.get("/:roomId/notes", authenticateJWT, getNotes);
  router.get("/:roomId/notes/:notesId", authenticateJWT, getIndividual);
  router.put("/:roomId/notes/:notesId", authenticateJWT, updateNote);
  router.delete("/:roomId/notes/:noteId", authenticateJWT, deleteNote);
  return router;
};
// module.exports = router;
