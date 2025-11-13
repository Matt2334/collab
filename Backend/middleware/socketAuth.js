const jwt = require("jsonwebtoken");
// const prisma = require('../prisma');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authenticateSocketJWT = async (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
      throw new Error("No cookies provided");
    }
    const token = cookies.split('; ')
      .find(c => c.startsWith('token='))
      ?.split('=')[1];
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
      throw new Error("User not found");
    }

    return {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    };
  } catch (err) {
    console.log(err)
    throw new Error("Invalid or expired token");
  }
};
module.exports = authenticateSocketJWT ;
