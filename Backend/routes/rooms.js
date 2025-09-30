const express = require("express")
const router = express.Router()

router.post('/create')
router.put('/rooms/:roomId/add')
router.get('/list')
router.delete('/delete')
module.exports = router;