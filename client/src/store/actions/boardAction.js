import { boardService } from "../../services/boardService"
import { socketService } from "../../services/socketService"
import { userService } from "../../services/userService"
export function loadBoards(userId) {
    return async dispatch => {
        try {
            const boards = await boardService.query(userId)
            const action = {
                type: 'SET_BOARDS',
                boards
            }
            dispatch(action)
            return boards
        } catch (err) {
            throw err
        }
    }
}
export function getBoardsByUserId(userId) {
    return async () => {
        try {
            const boards = await boardService.query(userId)
            return boards
        } catch (err) {
            throw err
        }
    }
}
export function changeBoardTitle(newTitle, board, user) {
    return async (dispatch) => {
        try {
            const boardToUpdate = await boardService.changeBoardTitle(newTitle, board, user)
            const action = {
                type: 'SET_CURR_BOARD',
                board: boardToUpdate
            }
            dispatch(action)
        } catch (err) {
            const action = {
                type: 'SET_CURR_BOARD',
                board
            }
            dispatch(action)
            throw err
        }
    }
}
export function removeBoard(boardId) {
    return async (dispatch) => {
        try {
            await boardService.removeBoard(boardId)
            const action = {
                type: 'REMOVE_BOARD',
                boardId
            }
            dispatch(action)
        } catch (err) {
            throw err
        }
    }
}
export function updateBoards(board) {
    return (dispatch) => {
        const action = {
            type: 'UPDATE_BOARDS',
            board
        }
        dispatch(action)
    }
}
export function getBoardById(boardId) {
    return async (dispatch) => {
        try {
            const board = await boardService.getBoardById(boardId)
            const action = {
                type: 'SET_CURR_BOARD',
                board
            }
            dispatch(action)
            return board
        } catch (err) {
            throw err
        }
    }
}
export function addCard(cardToAdd) {
    return async (dispatch) => {
        try {
            const board = await boardService.addCard(cardToAdd)
            const action = {
                type: 'SET_CURR_BOARD',
                board
            }
            dispatch(action)
        } catch (err) {
            const action = {
                type: 'SET_CURR_BOARD',
                board: cardToAdd.board
            }
            dispatch(action)
            throw err
        }
    }
}
export function addGroup(board, user) {
    return async (dispatch) => {
        try {
            const boardToUpdate = await boardService.addGroup(board, user)
            const action = {
                type: 'SET_CURR_BOARD',
                board: boardToUpdate
            }
            dispatch(action)
        } catch (err) {
            const action = {
                type: 'SET_CURR_BOARD',
                board
            }
            dispatch(action)
            throw err
        }
    }
}
export function addBoard(boardTitle, user) {
    return async (dispatch) => {
        try {
            const board = await boardService.addBoard(boardTitle, user)
            const action = {
                type: 'ADD_BOARD',
                board
            }
            dispatch(action)
        } catch (err) {
            console.log(err);
        }
    }
}
export function changeGroupIdx(board, result) {
    return async () => {
        try {
            return await boardService.changeGroupIdx(board, result)
        } catch (err) {
            console.log(err);
        }
    }
}
export function changeCardIdx(board, result) {
    return async (dispatch) => {
        return await boardService.changeCardIdx(board, result)
    }
}
export function deleteCard(cardToDelete) {
    return async (dispatch) => {
        try {
            const boardToUpdate = await boardService.deleteCard(cardToDelete)
            const action = {
                type: 'SET_CURR_BOARD',
                board: boardToUpdate
            }
            dispatch(action)
        } catch (err) {
            const action = {
                type: 'SET_CURR_BOARD',
                board: cardToDelete.board
            }
            dispatch(action)
            throw err
        }
    }
}
export function changeBoardMemebrs(memberData, board, type, user) {
    return async () => {
        try {
            const notification = await boardService.changeBoardMemebrs(memberData, board, type, user)
            const userToUpdate = await userService.updateNotifications(notification)
            socketService.emit('onUpdateUser', userToUpdate)
        } catch (err) {
            console.log(err);
        }
    }
}
export function removeGroup(board, group, user) {
    return async (dispatch) => {
        try {
            const boardToUpdate = await boardService.removeGroup(board, group, user)
            const action = {
                type: 'SET_CURR_BOARD',
                board: boardToUpdate
            }
            dispatch(action)
        } catch (err) {
            const action = {
                type: 'SET_CURR_BOARD',
                board
            }
            dispatch(action)
            throw err
        }
    }
}
export function changeCardLabels(board, card, groupId, label, labelType, user) {
    return async (dispatch) => {
        try {
            const boardToUpdate = await boardService.changeCardLabels(board, card, groupId, label, labelType, user)
            const action = {
                type: 'SET_CURR_BOARD',
                board: boardToUpdate
            }
            dispatch(action)
        } catch (err) {
            const action = {
                type: 'SET_CURR_BOARD',
                board
            }
            dispatch(action)
            throw err
        }
    }
}
export function addCardLabel(board, groupId, label, labelGroup) {
    return async (dispatch) => {
        try {
            const boardToUpdate = await boardService.addCardLabel(board, groupId, label, labelGroup)
            const action = {
                type: 'SET_CURR_BOARD',
                board: boardToUpdate
            }
            dispatch(action)
        } catch (err) {
            const action = {
                type: 'SET_CURR_BOARD',
                board
            }
            dispatch(action)
            throw err
        }
    }
}
export function changeCardTitle(cardToUpdate) {
    return async () => {
        try {
            await boardService.changeCardTitle(cardToUpdate)
        } catch (err) {
            console.log(err);
        }
    }
}
export function changeGroupColor(color, board, groupId) {
    return async (dispatch) => {
        try {
            const boardToUpdate = await boardService.changeGroupColor(color, board, groupId)
            const action = {
                type: 'SET_CURR_BOARD',
                board: boardToUpdate
            }
            dispatch(action)
        } catch (err) {
            const action = {
                type: 'SET_CURR_BOARD',
                board
            }
            dispatch(action)
            throw err
        }
    }
}
export function onChangeGroupTitle(groupToUpdate) {
    return async (dispatch) => {
        try {
            const board = await boardService.changeGroupTitle(groupToUpdate)
            const action = {
                type: 'SET_CURR_BOARD',
                board
            }
            dispatch(action)
        } catch (err) {
            const action = {
                type: 'SET_CURR_BOARD',
                board: groupToUpdate.board
            }
            dispatch(action)
            throw err
        }
    }
}
export function changeTaskMembers(memberId, sign, board, card, groupId, user) {
    return async () => {
        try {
            const notification = await boardService.updateTaskMembers(memberId, sign, board, card, groupId, user)
            const userToUpdate = await userService.updateNotifications(notification)
            socketService.emit('onUpdateUser', userToUpdate)
        } catch (err) {
        }
    }
}
export function changeCardDates(dates, board, groupId, card, user) {
    return async (dispatch) => {
        try {
            const boardToUpdate = await boardService.changeCardDates(dates, board, groupId, card, user)
            const action = {
                type: 'SET_CURR_BOARD',
                board: boardToUpdate
            }
            dispatch(action)
        } catch (err) {
            const action = {
                type: 'SET_CURR_BOARD',
                board
            }
            dispatch(action)
            throw err
        }
    }
}
export function getKeyById(object, targetValue) {
    return async () => {
        try {
            return boardService.getKeyById(object, targetValue)
        } catch (err) {
            console.log(err);
        }
    }
}
export function addCardUpdate(cardUpdate, board, card) {
    return async () => {
        try {
            return await boardService.addCardUpdate(cardUpdate, board, card)
        } catch (err) {
            console.log(err);
        }
    }
}
export function onDragStart() {
    return (dispatch) => {
        const action = {
            type: 'ON_DRAG'
        }
        dispatch(action)
    }
}
export function onDragEnd() {
    return (dispatch) => {
        const action = {
            type: 'ON_DRAG_END'
        }
        dispatch(action)
    }
}