const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const logger = require('../../services/logger.service')
const socketService = require('../../services/socket.service')
// const asyncLocalStorage = require('../../services/als.service')


async function query(filterBy) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('board')
        var boards = await collection.find(criteria).toArray()
        return boards

    } catch (err) {
        logger.error(`cannot find boards`, err)
        throw err

    }
}

async function getById(boardId) {
    // const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('board')
        const board = await collection.findOne({ "_id": ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error(`cannot find board`, err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.deleteOne({ '_id': ObjectId(boardId) })
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {
        const boardToAdd = { ...board }
        boardToAdd.createdAt = Date.now()
        const collection = await dbService.getCollection('board')
        await collection.insertOne(boardToAdd)
        return boardToAdd
    } catch (err) {
        logger.error('cannot add board', err)
        throw err
    }
}

async function update(board) {
    try {
        const boardToSave = { ...board, _id: ObjectId(board._id) }
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ '_id': boardToSave._id }, { $set: boardToSave })
        return boardToSave
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}



function _buildCriteria(filterBy) {

    const criteria = {}
    if (filterBy.userId) {
        criteria.members = { $elemMatch: { _id: ObjectId(filterBy.userId) } }
        // {members:{$elemMatch:{_id:ObjectId(filterBy.userId)}}}
    }
    return criteria
}


module.exports = {
    remove,
    query,
    getById,
    add,
    update
}