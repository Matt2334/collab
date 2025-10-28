const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// router.post("/signup");
const createAccount = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name: name, email: email, password: hPassword },
    });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// router.get("/login");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const pMatch = await bcrypt.compare(password, user.password);
    if (!pMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // CSRF protection
      maxAge: 3600000 
    });
    res.status(200).json({message:'Login Successful' });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};
// router.get("/logout");
const logout = async (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: "Logged out successfully" });
  });
};
// router.put("/update-record");
const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { email, password } = req.body;
  try {
    const hPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        hPassword,
      },
    });
    res.json({ message: "Account updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// router.delete("/delete");
const deleteAccount = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(404).json({ message: "You are forbidden from this action" });
  }
  await prisma.note.deleteMany({ where: { createdById: userId } });
  await prisma.roomUser.deleteMany({ where: { userId } });
  await prisma.room.deleteMany({ where: { ownerId: userId } });
  await prisma.user.delete({ where: { id: userId } });
  res.json({ message: "Account deleted" });
  try {
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createAccount, login, logout, updateUser, deleteAccount };
