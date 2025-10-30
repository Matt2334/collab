const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotes,
  getIndividual,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

router.post("/:roomId/notes", createNote);
router.get("/:roomId/notes", getNotes);
router.get("/:roomId/notes/:notesId", getIndividual);
router.put("/:roomId/notes/:notesId", updateNote);
router.delete("/:roomId/notes/:noteId", deleteNote);

module.exports = router;
