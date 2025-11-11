const express = require("express");
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
  router.post("/:roomId/notes", createNote);
  router.get("/:roomId/notes", getNotes);
  router.get("/:roomId/notes/:notesId", getIndividual);
  router.put("/:roomId/notes/:notesId", updateNote);
  router.delete("/:roomId/notes/:noteId", deleteNote);
  return router;
};
// module.exports = router;
