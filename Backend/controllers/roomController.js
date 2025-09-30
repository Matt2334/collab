const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

// router.post('/create')
const createRoom = async (req, res) => {
  const { name } = req.body;
  const userId = req.user?.id;
  try {
    if (!userId) {
      res.status(403).json({ message: "Action Forbidden" });
    }
    const newRoom = await prisma.room.create({
      data: { name: name, ownerId: userId },
    });

    await prisma.roomUser.create({
      data: {
        roomId: newRoom.id,
        userId: userId,
        role: "admin",
      },
    });
    res.status(201).json({ message: "Room created", room: newRoom });
  } catch (err) {
    res.status(500).json({ message: "Internal Service Error" });
  }
};
// router.put('/rooms/:roomId/add')
const addMembers = async (req, res) => {
  const { roomId } = req.params;
  const { email } = req.body;
  const userId = req.user?.id;
  try {
    if (!userId) {
      res.status(403).json({ message: "Action Forbidden" });
    }
    const room = await prisma.room.findFirst({ where: { id: Number(roomId) } });
    if (!room || room.ownerId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this room" });
    }
    const member = await prisma.user.findFirst({ where: { email: email } });
    if (!member) {
      res.status(404).json({ message: "Cannot locate user" });
    }
    const alreadyPresent = member.joinedRooms.some((j) => j.roomId === room.id);
    if (alreadyPresent) {
      res.status(400).json({ message: "User is already in the room" });
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
const getRooms = async (req,res)=>{
    
}
// router.delete('/delete')
module.exports = { createRoom, addMembers, getRooms, deleteRoom };
