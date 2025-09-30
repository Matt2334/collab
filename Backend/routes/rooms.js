const express = require("express")
const router = express.Router()

router.post('/create')
router.put('/join')
router.get('/list:listId')
router.delete('/delete')
module.exports = router;