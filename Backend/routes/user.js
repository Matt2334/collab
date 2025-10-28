const express = require("express");
const router = express.Router();
const {
  createAccount,
  login,
  logout,
  updateUser,
  deleteAccount,
} = require("../controllers/userController");

router.post("/login", login);
router.get("/logout", logout); 
router.post("/signup", createAccount);
router.put("/update-record", updateUser);
router.delete("/delete", deleteAccount);
module.exports = router;
