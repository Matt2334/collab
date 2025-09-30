const express = require("express");
const router = express.Router();
const {
  createAccount,
  login,
  logout,
  updateUser,
  deleteAccount,
} = require("../controllers/userController");

router.get("/login", login);
router.get("/logout", logout); // not yet implemented
router.post("/signup", createAccount);
router.put("/update-record", updateUser);
router.delete("/delete", deleteAccount);
module.exports = router;
