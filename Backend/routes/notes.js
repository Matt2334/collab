const express = require("express");
const router = express.Router();

router.get("/record");
router.post("/create");
router.put("/update");
router.delete("/delete")

module.exports = router;
