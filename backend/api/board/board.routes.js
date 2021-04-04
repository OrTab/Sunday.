const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addBoard, getBoards, deleteBoard, updateBoard, getBoard } = require('./board.controller')
const router = express.Router()


router.get('/', getBoards)
router.get('/:id', getBoard)
router.post('/', requireAuth, addBoard)
// router.post('/', requireAuth, addBoard)
router.put('/', requireAuth, updateBoard)
// router.put('/', requireAuth, updateBoard)
router.delete('/:id', requireAuth, deleteBoard)
// requireAuth, requireAdmin,

module.exports = router