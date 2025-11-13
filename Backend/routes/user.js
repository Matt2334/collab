const express = require("express");
const authenticateJWT = require("../middleware/auth.js");
const router = express.Router();
const {
  createAccount,
  login,
  logout,
  updateUser,
  deleteAccount,
} = require("../controllers/userController");

router.post("/login", login);
router.get("/logout", authenticateJWT, logout); 
router.post("/signup", createAccount);
router.put("/update-record",authenticateJWT,  updateUser);
router.delete("/delete", authenticateJWT, deleteAccount);
module.exports = router;
