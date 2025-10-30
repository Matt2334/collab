const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// router.get("/:roomId/notes");
const getNotes = async (req, res) => {
  const { roomId } = req.params;
  const userId = req?.userId;
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: Number(roomId),
        OR: [
          { owner: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
    });
    if (!room) {
      return res.status(404).json({ message: "Cannot find room" });
    }

    const notes = await prisma.note.findMany({
      where: { roomId: room.id },
      orderBy: { createdAt: "desc" },
      include: {
        room: {
          select: {
            name: true,
          },
        },
      },
    });
    console.log(notes);
    if (!notes) {
      return res.status(404).json({ message: "Notes Not Found" });
    }
    return res.status(200).json(notes);
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
// router.post("/:roomId/notes");
const createNote = async (req, res) => {
  const { roomId } = req.params;
  const userId = req?.userId;
  try {
    const room = await prisma.room.findUnique({
      where: { id: Number(roomId) },
    });
    if (!room) {
      return res.status(404).json({ message: "Cannot find room" });
    }
    const newNote = await prisma.note.create({
      data: { title: "", content: "", roomId: room.id, createdById: userId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return res.status(201).json(newNote);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// router.put("/:roomId/notes/:notesId");
const updateNote = async (req, res) => {
  const { roomId, notesId } = req.params;
  const { title, content } = req.body;
  const userId = req?.userId;

  try {
    const roomMember = await prisma.roomUser.findFirst({
      where: { userId: userId, roomId: Number(roomId) },
    });
    if (!roomMember) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const note = await prisma.note.update({
      where: { roomId: Number(roomId), id: Number(notesId) },
      data: { title: title, content: content },
      include: {
        room: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!note) {
      return res.status(404).json({ message: "Cannot find note" });
    }

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// router.delete("/:roomId/notes/:notesId");
const deleteNote = async (req, res) => {
  const { roomId, noteId } = req.params;
  const userId = req?.userId;
  try {
    // verify that current user is a member of that room
    const roomMember = await prisma.roomUser.findFirst({
      where: { userId: userId, roomId: Number(roomId) },
    });
    if (!roomMember) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // verify that the note exists
    const note = await prisma.note.findUnique({
      where: { id: parseInt(noteId) },
      include: { room: true },
    });
    // if the note doesn't exist or the room ID assigned to the note isn't the same as the roomId provided
    if (!note || note.roomId !== Number(roomId)) {
      return res.status(404).json({ message: "Note not found" });
    }
    // otherwise, we successfully delete the note
    await prisma.note.delete({
      where: { roomId: parseInt(roomId), id: parseInt(noteId) },
    });

    res.status(200).json({ message: "Note Deleted" });
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
