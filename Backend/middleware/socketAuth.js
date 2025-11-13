const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authenticateSocketJWT = async (socket, next) => {
  let token;
  try {
    const cookies = socket.handshake.headers.cookie;
    if (cookies) {
      token = cookies
        .split("; ")
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];
    }

    if (!token) {
      console.warn("⚠️ No token - allowing anonymous connection");
      socket.isAuthenticated = false;
      socket.userId = null;
      socket.userName = "Anonymous";
      return next();
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      socket.isAuthenticated = false;
      socket.userId = null;
      socket.userName = "Anonymous";
    } else {
      socket.isAuthenticated = true;
      socket.userId = user.id;
      socket.userName = user.name;
      socket.userEmail = user.email;
    }

    return next();
  } catch (err) {
    console.log(err);
    console.warn("Socket auth failed, marking as anonymous:", err.message);
    socket.isAuthenticated = false;
    socket.userId = null;
    socket.userName = "Anonymous";
    return next();
  }
};
module.exports = authenticateSocketJWT;
