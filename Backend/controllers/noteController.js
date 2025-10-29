const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// router.post("/:roomId/notes");
const createNote = async (req, res) => {
  const { roomId } = req.params;
  const { content } = req.body;
  const userId = req?.userId;
  try {
    const room = await prisma.room.findUnique({
      where: { id: Number(roomId) },
    });
    if (!room) {
      return res.status(404).json({ message: "Cannot find room" });
    }
    const note = await prisma.note.create({
      data: { content: content, roomId: room.id, createdById: userId },
    });
    return res.status(201).json(note);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// router.get("/:roomId/notes");
const getNotes = async (req, res) => {
  const { roomId } = req.params;
  const userId = req?.userId;
  try {
    const room = await prisma.room.findUnique({
      where: { id: Number(roomId) },
    });
    if (!room) {
      return res.status(404).json({ message: "Cannot find room" });
    }
    const roomMember = await prisma.roomUser.findUnique({
      where: { userId: userId, roomId: room.id },
    });
    if (!roomMember) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const notes = await prisma.note.findMany({
      where: { roomId: room.id },
      orderBy: { createdAt: "desc" },
    });
    return res.status(201).json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// router.get("/:roomId/notes/:notesId");
const getIndividual = async (req, res) => {
  const { roomId, notesId } = req.params;
  try {
    const note = await prisma.note.findUnique({
      where: { roomId: Number(roomId), id: Number(notesId) },
    });
    if (!note) {
      return res.status(404).json({ message: "Cannot find note" });
    }
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// router.put("/:roomId/notes/:notesId");
const updateNote = async (req, res) => {
  const { roomId, notesId } = req.params;
  const { content } = req.body;
  const userId = req?.userId;
  try {
    const roomMember = await prisma.roomUser.findUnique({
      where: { userId: userId, roomId: Number(roomId) },
    });
    if (!roomMember) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const note = await prisma.note.update({
      where: { roomId: Number(roomId), id: Number(notesId) },
      data: { content: content },
    });
    if (!note) {
      return res.status(404).json({ message: "Cannot find note" });
    }

    res.status(201).json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// router.delete("/:roomId/notes/:notesId");
const deleteNote = async (req, res) => {
  const { roomId, notesId } = req.params;
  const userId = req?.userId;
  try {
    // verify that current user is a member of that room
    const roomMember = await prisma.roomUser.findUnique({
      where: { userId: userId, roomId: Number(roomId) },
    });
    if (!roomMember) {
      return res.status(403).json({ message: "Forbidden" });
    }
    // verify that the note exists
    const note = await prisma.note.findUnique({
      where: { id: Number(notesId) },
    });
    // if the note doesn't exist or the room ID assigned to the note isn't the same as the roomId provided
    if (!note || note.roomId !== Number(roomId)) {
      return res.status(404).json({ message: "Note not found" });
    }
    // otherwise, we successfully delete the note
    await prisma.note.delete({
      where: { roomId: Number(roomId), id: Number(notesId) },
    });

    res.status(201).json({ message: "Note Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createNote,
  getNotes,
  getIndividual,
  updateNote,
  deleteNote,
};
