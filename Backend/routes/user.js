const express = require("express");
const router = express.Router();

router.get("/login");
router.get("/logout");
router.post("/signup");
router.put("/update-record");
router.delete("/delete");
module.exports = router;
