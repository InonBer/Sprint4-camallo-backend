const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addBoard, getBoards, deleteBoard, updateBoard, getById } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)
router.get('/', log, getBoards)
router.get('/:id', log, getById)
router.post('/', log, addBoard)
router.delete('/:id', deleteBoard)
router.put('/:id', updateBoard)

module.exports = router