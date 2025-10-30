const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// router.post('/create')
const createRoom = async (req, res) => {
  const { name, description } = req.body;
  const userId = req?.userId;
  try {
    if (!userId) {
      return res.status(403).json({ message: "Action Forbidden" });
    }
    const newRoom = await prisma.room.create({
      data: { name: name, desc: description, ownerId: userId },
    });

    await prisma.roomUser.create({
      data: {
        roomId: newRoom.id,
        userId: userId,
        role: "admin",
      },
    });
    return res.status(201).json({ message: "Room created", room: newRoom });
  } catch (err) {
    res.status(500).json({ message: "Internal Service Error" });
  }
};
// router.put('/rooms/:roomId/add')
const addMembers = async (req, res) => {
  const { roomId } = req.params;
  const { email } = req.body;
  const userId = req?.userId;
  try {
    if (!userId) {
      return res.status(403).json({ message: "Action Forbidden" });
    }
    const room = await prisma.room.findFirst({ where: { id: Number(roomId) } });
    if (!room || room.ownerId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this room" });
    }
    const member = await prisma.user.findFirst({ where: { email: email } });
    if (!member) {
      return res.status(404).json({ message: "Cannot locate user" });
    }
    const alreadyPresent = member.joinedRooms.some((j) => j.roomId === room.id);
    if (alreadyPresent) {
      return res.status(400).json({ message: "User is already in the room" });
    }
    const addUser = await prisma.roomUser.create({
      data: {
        roomId: room.id,
        userId: member.id,
      },
    });
    res.status(201).json({ message: `${email} successfully added` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// router.get('/list')
const getRooms = async (req, res) => {
  const userId = req?.userId;
  try {
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const roomQuery = await prisma.room.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        notes: {
          take: 1,
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            updatedAt: true,
          },
        },
        _count: {
          select: {
            notes: true,
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", 
      },
    });
    const allRooms = roomQuery.map(room=>({
      id:room.id,
      name:room.name,
      desc:room.desc,
      author:room.owner.name,
      lastActive: room.notes[0]?.updatedAt || room.createdAt,
      noteCount:room._count.notes,
      memberCount:room._count.members,
    }))

    return res.status(200).json(allRooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// router.delete('/:roomId/leave')
const deleteRoom = async (req, res) => {
  const { roomId } = req.params;
  const userId = req?.userId;
  try {
    const room = await prisma.room.findUnique({
      where: { id: Number(roomId) },
    });
    if (!room) {
      return res.status(404).json({ message: "Room cannot be located" });
    }
    if (room.ownerId === userId) {
      await prisma.note.deleteMany({ where: { roomId: room.id } });
      await prisma.roomUser.deleteMany({ where: { roomId: room.id } });
      await prisma.room.delete({ where: { id: room.id } });
      res.status(201).json({ message: "Room was deleted" });
    } else {
      await prisma.roomUser.delete({
        where: { roomId: room.id, userId: userId },
      });
      res.status(201).json({ message: "Room was removed from your account" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { createRoom, addMembers, getRooms, deleteRoom };
