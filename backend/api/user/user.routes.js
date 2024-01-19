const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getUser, getUsers, deleteUser, updateUser,getUsersForBoard} = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers)
router.get('/boardMembers', getUsersForBoard)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id',  requireAuth, requireAdmin, deleteUser)

module.exports = router