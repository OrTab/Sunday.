const { ObjectId } = require('mongodb');
const  socketService = require('../../services/socket.service');
const logger = require('../../services/logger.service')
// const userService = require('../user/user.service')
const boardService = require('./board.service')



async function getBoards(req, res) {
    try {
        const filterBy = req.query
        const boards = await boardService.query(filterBy)
        res.send(boards)
    } catch (err) {
        logger.error('Cannot get boards')
        res.status(500).send({ err: 'Failed to get boards' })
    }
}


async function deleteBoard(req, res) {
    try {
        const { id } = req.params
        await boardService.remove(id)
        res.send('Deleted successfully')
    } catch (err) {
        logger.error('Failed to delete board', err)
        res.status(500).send({ err: 'Failed to delete board' })
    }
}


async function getBoard(req, res) {
    try {
       
        const board = await boardService.getById(req.params.id)
        res.send(board)
    } catch (err) {
        logger.error('Failed to get board', err)
        res.status(500).send({ err: 'Failed to get board' })
    }
}

async function addBoard(req, res) {
    try {
        const board = req.body
        const user = req.session.user
        board.createdBy = {
            _id: ObjectId(user._id),
            fullname: user.fullname,
            imgUrl: user.imgUrl || null
        }
        board.members = [{ ...board.createdBy }]
        board.groups[0].createdBy = { ...board.createdBy }
        board.groups[0].cards[0].members = [{ ...board.createdBy }]
        board.groups[0].cards[0].createdBy = { ...board.createdBy }
        const newBoard = await boardService.add(board)
        res.send(newBoard)
    } catch (err) {
        logger.error('Failed to add board', err)
        res.status(500).send({ err: 'Failed to add board' })

    }
}
async function updateBoard(req, res) {
    try {
        const board = req.body
        board.members.forEach(member => member._id = ObjectId(member._id))
        board.groups.forEach(group => {
            group.createdBy._id = ObjectId(group.createdBy._id)
            group.cards.forEach(card => {
                card.createdBy._id = ObjectId(card.createdBy._id)
                card.members.forEach(member => member._id = ObjectId(member._id))
            })
        })
        const updatedBoard = await boardService.update(board)
        socketService.emitToMyBoard( 'boardUpdate',  updatedBoard )
        res.send(updatedBoard)
        
    } catch (err) {
        console.log('err on update',err);
        logger.error('Failed to update board')
        res.status(500).send({ err: 'Failed to update board' })
    }
}


module.exports = {
    deleteBoard,
    getBoards,
    getBoard,
    addBoard,
    updateBoard
}