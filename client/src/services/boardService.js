import { utilService } from '../services/utilService.js'
import { httpService } from './httpService.js';


export const boardService = {
    query,
    removeBoard,
    getBoardById,
    addCard,
    addBoard,
    addGroup,
    deleteCard,
    getBoardIdByIdx,
    changeBoardTitle,
    changeCardTitle,
    changeGroupTitle,
    updateTaskMembers,
    changeCardDates,
    changeCardLabels,
    deleteLabel,
    changeGroupColor,
    removeGroup,
    changeBoardMemebrs,
    changeGroupIdx,
    changeCardIdx,
    sortByTitle,
    sortByDate,
    sortCardByDate,
    addCardLabel,
    updateActivities,
    deepSearchByKey,
    getKeyById,
    addCardUpdate,

}


function getKeyById(source, target) {

    const sourceSet = new Set()
    return findTarget(source, target)

    function findTarget(source, target) {


        if (!source) {
            sourceSet.clear()
            return
        }

        if (sourceSet.has(source)) {

            sourceSet.clear()
            return
        }

        sourceSet.add(source)

        if (Array.isArray(source)) {
            for (let arrayItem of source) {
                const value = findTarget(arrayItem, target);
                if (value) return value
            }
        } else if (typeof source === 'object') {
            for (let key of Object.keys(source)) {
                if (source[key] === target) {
                    return source
                } else if (typeof source[key] === 'object' || Array.isArray(source[key])) {
                    const value = findTarget(source[key], target)
                    if (value) return value
                }
            }
        }
    }


}



function deepSearchByKey(object, originalKey, matches = []) {

    if (object !== null) {
        if (Array.isArray(object)) {
            for (let arrayItem of object) {
                deepSearchByKey(arrayItem, originalKey, matches);
            }
        } else if (typeof object === 'object') {

            for (let key of Object.keys(object)) {
                if (key === 'groups') {
                    deepSearchByKey(object[key], originalKey, matches);

                } else if (key === 'cards' && object.hasOwnProperty('cards')) {
                    object[key].forEach(obj => {
                        if (obj._id === originalKey) matches.push(object)
                    })
                } else {
                    deepSearchByKey(object[key], originalKey, matches);
                }

            }

        }
    }

    return matches;
}




async function query(userId) {

    try {
        var queryStr = (!userId) ? '' : `?userId=${userId}`
        return httpService.get(`board${queryStr}`)
    } catch (err) {
        throw new Error('couldn\'t find boards')
    }
}

async function getBoardById(boardId, filterBy) {
    try {
        return httpService.get(`board/${boardId}`)
    } catch (err) {
        throw new Error('couldn\'t find board')
    }
}
async function removeBoard(boardId) {
    return httpService.delete(`board/${boardId}`)
    // return await storageService.remove('boards', boardId)
}

function getBoardIdByIdx(boardIdx, boards) {
    const currBoardId = (!boardIdx && boards.length) ? boards[1]?._id : boards[boardIdx - 1]?._id
    return currBoardId
}



async function addBoard(boardTitle, userId) {
    try {
        const boardToAdd = {
            title: boardTitle,
            createdBy: userId,
            members: [userId],
            activities: [],
            groups: [_createDefaultGroup(userId)]
        }
        // return await storageService.post('boards', boardToAdd)
        return httpService.post('board', boardToAdd)
    } catch (err) {
        throw err

    }
}
//TODO: use recursion func
function _findGroupById(board, groupId) {
    const group = board.groups.find(group => groupId === group.id)
    return group
}

async function addCard({ board, groupId, cardTitle, user }) {
    try {
        const boardToUpdate = { ...board }
        const groupToUpdate = _findGroupById(boardToUpdate, groupId)
        const activityText = `added a new card : ${cardTitle}, to group : ${groupToUpdate.title}`
        const activity = _createBoardActivity(user, activityText)
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]
        // groupToUpdate.cards.push(_createCard(cardTitle, user._id))
        groupToUpdate.cards = [...groupToUpdate.cards, (_createCard(cardTitle, user._id))]
        boardToUpdate.groups = boardToUpdate.groups.map(group => group.id === groupToUpdate.id ? groupToUpdate : group)
        httpService.put('board', boardToUpdate)
        return boardToUpdate
    } catch (err) {
        throw err
    }

}

async function addGroup(board, user) {
    try {
        const boardToUpdate = { ...board }
        const activityText = `added a new group`
        const activity = _createBoardActivity(user, activityText)
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]
        const newGroup = _createDefaultGroup(user._id);
        boardToUpdate.groups.unshift(newGroup)
        httpService.put('board', boardToUpdate)
        return boardToUpdate
    } catch (err) {
        throw err
    }
}

async function deleteCard({ board, groupId, cardId, user }) {
    try {
        const boardToUpdate = { ...board }
        const groupToUpdate = _findGroupById(boardToUpdate, groupId)
        const activityText = `deleted a card in group : ${groupToUpdate.title}`
        const activity = _createBoardActivity(user, activityText)
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]

        groupToUpdate.cards = groupToUpdate.cards.filter(card => card.id !== cardId)
        boardToUpdate.groups = boardToUpdate.groups.map(group => group.id === groupToUpdate.id ? groupToUpdate : group)
        httpService.put('board', boardToUpdate)
        return boardToUpdate
    } catch (err) {
        throw err
    }
}

async function changeBoardTitle(newTitle, board, user) {

    const boardToUpdate = { ...board }
    const activityText = `changed board title from '${boardToUpdate.title}' to '${newTitle}'`
    const activity = _createBoardActivity(user, activityText)
    boardToUpdate.activities = [activity, ...boardToUpdate.activities]
    boardToUpdate.title = newTitle
    httpService.put('board', { boardToUpdate, isChangeBoardName: true })
    return boardToUpdate
}

function sortByTitle(groupsToSort) {
    groupsToSort.sort((group1, group2) => {
        if (group1.title.toLowerCase() > group2.title.toLowerCase()) return 1
        else if (group1.title.toLowerCase() < group2.title.toLowerCase()) return -1;
        else return 0;
    })
    return groupsToSort
}

function sortByDate(groupsToSort) {
    groupsToSort.sort((group1, group2) => {
        return group2.createdAt - group1.createdAt
    })
    return groupsToSort
}

function sortCardByDate(cards) {
    let cardsToSort = JSON.parse(JSON.stringify(cards))
    cardsToSort = cardsToSort.sort((card1, card2) => {
        var card1Sort;
        var card2Sort;
        if (card1.dueDate.endDate) {
            card1Sort = card1.dueDate.endDate
        } else card1Sort = card1.dueDate.startDate ? card1.dueDate.startDate : card1.createdAt
        if (card2.dueDate.endDate) {
            card2Sort = card2.dueDate.endDate
        } else card2Sort = card2.dueDate.startDate ? card2.dueDate.startDate : card2.createdAt

        return new Date(card1Sort).getTime() - new Date(card2Sort).getTime()

    })
    return cardsToSort
}

async function changeGroupColor(color, board, groupId) {
    try {

        const boardToUpdate = { ...board }
        const groups = boardToUpdate.groups.map(group => {
            if (group.id === groupId) {
                group.style.color = color
                return group
            } else return group
        })
        boardToUpdate.groups = groups
        httpService.put('board', boardToUpdate)
        return boardToUpdate
    } catch (err) {
        throw err
    }
}

async function removeGroup(board, groupToUpdate, user) {
    try {
        const boardToUpdate = { ...board }
        const activityText = `removed group ${groupToUpdate.title}`
        const activity = _createBoardActivity(user, activityText)
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]

        const groups = boardToUpdate.groups.filter(group => group.id !== groupToUpdate.id)
        boardToUpdate.groups = groups
        httpService.put('board', boardToUpdate)
        return boardToUpdate

    } catch (err) {
        throw err
    }

}

async function changeGroupIdx(board, result) {
    try {

        // console.log(board);
        // const sourceGroup = boardToUpdate.groups[source.index]
        // boardToUpdate.groups[source.index] = boardToUpdate.groups[destination.index]
        // boardToUpdate.groups[destination.index] = sourceGroup
        // console.log(boardToUpdate.groups);
        return await httpService.put('board', board)
    } catch (err) {
        throw err
    }
}

async function changeCardIdx(boardToUpdate, result) {

    try {
        return httpService.put('board', boardToUpdate)
    } catch (err) {
        throw err
    }
}


async function changeGroupTitle({ board, groupId, groupTitle, user }) {
    try {
        const boardToUpdate = { ...board }
        let prevTitle = ''

        const groups = boardToUpdate.groups.map(group => {
            if (group.id === groupId) {
                prevTitle = group.title
                group.title = groupTitle
                return group
            } else return group
        })
        boardToUpdate.groups = groups
        const activityText = `changed group title from ${prevTitle} to ${groupTitle}`
        const activity = _createBoardActivity(user, activityText)
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]
        httpService.put('board', boardToUpdate)
        return boardToUpdate
    } catch (err) {
        // console.log(err);
    }
}

function updateTaskMembers(member, sign, board, cardToUpdate, groupId, user) {
    try {
        const boardToUpdate = { ...board }
        const groupToUpdate = _findGroupById(boardToUpdate, groupId)
        // const member = boardToUpdate.members.find(memberId => memberId === memberIdToUpdate)
        let cards;
        let activityText;
        let notificationTxt;

        if (sign === 'remove') {
            activityText = `removed ${member._id === user._id ? 'yourself' : member.fullname} from card '${cardToUpdate.title}' `
            if (member._id !== user._id) notificationTxt = `${user.fullname} removed you from card '${cardToUpdate.title}' in group : ${groupToUpdate.title}`
            cards = groupToUpdate.cards.map(card => {
                if (cardToUpdate.id === card.id) {
                    const members = card.members.filter(memberId => memberId !== member._id)
                    card.members = members
                    return card
                } else return card
            })
        }
        else {
            activityText = `added ${member._id === user._id ? 'yourself' : member.fullname} to card '${cardToUpdate.title}'`
            if (member._id !== user._id) notificationTxt = `${user.fullname} added you to card '${cardToUpdate.title}' in group : ${groupToUpdate.title}`
            cards = groupToUpdate.cards.map(card => {
                if (cardToUpdate.id === card.id) {
                    const members = [...card.members, member._id]
                    card.members = members
                    return card
                } else return card
            })
        }

        const activity = _createBoardActivity(user, activityText)
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]
        groupToUpdate.cards = cards
        const groups = boardToUpdate.groups.map(group => group.id === groupToUpdate.id ? groupToUpdate : group)
        boardToUpdate.groups = groups
        httpService.put('board', boardToUpdate)
        if (notificationTxt) return { memberId: member._id, notificationTxt, user, boardToUpdate }
        else return { boardToUpdate }
    } catch (err) {
        throw err
    }

}
// TODO: think of better way to update the UI , also in changeCardTaskMembers
function changeBoardMemebrs(memberData, board, type, user) {
    const boardToUpdate = { ...board }
    var activityText
    var notificationTxt

    if (type === 'remove') {
        if (memberData._id !== user._id) notificationTxt = `${user.fullname} removed you from '${board.title}' `
        activityText = `removed ${memberData.fullname} from this board`
        boardToUpdate.members = boardToUpdate.members.filter(memberId => memberId !== memberData._id)
        boardToUpdate.groups = boardToUpdate.groups.map(group => {
            group.cards = group.cards.map(card => {
                card.members = card.members.filter(memberId => memberId !== memberData._id);
                return card
            })
            return group;
        })

    } else {
        activityText = `added ${memberData.fullname} to this board`
        if (memberData._id !== user._id) notificationTxt = `${user.fullname} add you to '${board.title}'`
        boardToUpdate.members = [...boardToUpdate.members, memberData._id];
    }
    const activity = _createBoardActivity(user, activityText)
    boardToUpdate.activities = [activity, ...boardToUpdate.activities]
    httpService.put('board', boardToUpdate)
    if (notificationTxt) return { memberId: memberData._id, notificationTxt, user, boardToUpdate }
    return { boardToUpdate }
}

async function changeCardLabels({ board, cardToUpdate, groupId, label, labelType, user, labelGroup }) {
    try {
        const boardToUpdate = { ...board }
        const groupToUpdate = _findGroupById(boardToUpdate, groupId)
        const activityText = `updated ${labelType} in card '${cardToUpdate.title}' from '${cardToUpdate[labelType].text}' to '${label.text}'`
        const activity = _createBoardActivity(user, activityText)
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]
        groupToUpdate[labelGroup].forEach(currLabel => {
            if (currLabel.id === label.id) currLabel.isActive = true
            if (cardToUpdate[labelType].id === currLabel.id) currLabel.isActive = false
        })
        groupToUpdate.cards.forEach(card => {
            if (cardToUpdate.id === card.id) {
                card[labelType] = label;
                return card
            } else return card
        })
        const groups = boardToUpdate.groups.map(group => group.id === groupToUpdate.id ? groupToUpdate : group)
        boardToUpdate.groups = groups
        httpService.put('board', boardToUpdate)
        return boardToUpdate
    } catch (err) {
        throw err
    }
}


async function deleteLabel({ board, groupId, labelId, labelGroup, cardDetails }) {
    try {
        const boardToUpdate = JSON.parse(JSON.stringify(board))
        boardToUpdate.groups = boardToUpdate.groups.map(group => {
            if (group.id === groupId) {
                group[labelGroup] = group[labelGroup].filter(label => label.id !== labelId)
                group.cards = group.cards.map(card => {
                    if (card[cardDetails.labelType].id === labelId) {
                        card[cardDetails.labelType] = cardDetails.label
                        return card
                    } else return card
                })

                return group
            } else return group
        })
        httpService.put('board', boardToUpdate)
        return boardToUpdate
    } catch (err) {
        throw err
    }
}



async function addCardUpdate(cardUpdate, board, cardToUpdate) {
    try {
        cardUpdate.createdAt = Date.now()
        if (cardToUpdate.updates) {
            cardToUpdate.updates.unshift(cardUpdate)
        } else cardToUpdate.updates = [...cardUpdate]

        const boardToUpdate = JSON.parse(JSON.stringify(board))
        const groupsToUpdate = boardToUpdate.groups.map(group => {
            const cards = group.cards.map(card => {
                if (card.id === cardToUpdate.id) return cardToUpdate
                else return card
            })
            group.cards = cards
            return group
        })

        boardToUpdate.groups = groupsToUpdate
        return httpService.put('board', boardToUpdate)

    } catch (err) {
        throw err
    }
}


async function addCardLabel(board, groupId, label, labelGroup) {
    try {
        const boardToUpdate = { ...board }
        boardToUpdate.groups = boardToUpdate.groups.map(group => {
            if (group.id === groupId) {
                group[labelGroup] = [...group[labelGroup], { ...label }];
                return group;
            } else return group;
        })
        httpService.put('board', boardToUpdate)
        return boardToUpdate

    } catch (err) {
        throw err
    }
}

async function changeCardTitle({ board, groupId, cardToUpdate, cardTitle, user }) {
    try {
        const boardToUpdate = { ...board }
        const groupToUpdate = _findGroupById(boardToUpdate, groupId)
        const activityText = `changed card title from ${cardToUpdate.title} to ${cardTitle}`
        const activity = _createBoardActivity(user, activityText)
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]

        groupToUpdate.cards = groupToUpdate.cards.map(card => {
            if (card.id === cardToUpdate.id) {
                card.title = cardTitle
                return card
            } else return card
        })
        boardToUpdate.groups = boardToUpdate.groups.map(group => group.id === groupToUpdate.id ? groupToUpdate : group)
        return httpService.put('board', boardToUpdate)
    } catch (err) {
        console.log(err);
    }

}

async function changeCardDates(dates, board, groupId, cardToUpdate, user) {

    const boardToUpdate = JSON.parse(JSON.stringify(board))
    const groupToUpdate = _findGroupById(boardToUpdate, groupId)
    const activityText = `updated dates in card '${cardToUpdate.title}'`
    const activity = _createBoardActivity(user, activityText)
    boardToUpdate.activities = [activity, ...boardToUpdate.activities]

    const cards = groupToUpdate.cards.map(card => {
        if (card.id === cardToUpdate.id) {
            card.dueDate = dates
            return card
        } else return card
    })
    groupToUpdate.cards = cards
    const groups = boardToUpdate.groups.map(group => group.id === groupToUpdate.id ? groupToUpdate : group)
    boardToUpdate.groups = groups
    httpService.put('board', boardToUpdate)
    return boardToUpdate
}

function updateActivities(board, isClear) {
    const boardToUpdate = JSON.parse(JSON.stringify(board))
    if (isClear) boardToUpdate.activities = []
    else boardToUpdate.activities.forEach(activity => activity.isRead = true)
    return httpService.put('board', boardToUpdate)
}


function _createBoardActivity(user, txt) {
    return {
        id: utilService.makeId(),
        txt,
        isRead: false,
        createdAt: Date.now(),
        byMember: user._id
    }

}

function _createCard(cardTitle, userId) {
    return {
        id: utilService.makeId(),
        title: cardTitle,
        updates: [],
        members: [userId],
        status:
            { text: 'No status yet', color: '#cccccc', id: utilService.makeId() },
        priority:
            { text: 'Set priority', color: '#cccccc', id: utilService.makeId() },
        createdAt: Date.now(),
        dueDate: {
            startDate: '',
            endDate: ''
        },
        createdBy: userId
    }
}

function _createDefaultGroup(userId) {
    return {
        id: utilService.makeId(),
        title: "New group",
        createdBy: userId,
        createdAt: Date.now(),
        statuses: [
            { text: 'Done', color: '#00ca72', id: utilService.makeId(), isActive: false },
            { text: 'Stuck', color: '#fb275d', id: utilService.makeId(), isActive: false },
            { text: 'Working on it', color: '#ffcc00', id: utilService.makeId(), isActive: false }
        ],
        priorities: [
            { text: 'Low', color: '#6bf1b9', id: utilService.makeId(), isActive: false },
            { text: 'Medium', color: '#6b97f1', id: utilService.makeId(), isActive: false },
            { text: 'High', color: '#ff812f', id: utilService.makeId(), isActive: false },
            { text: 'Urgent', color: '#ff2f2f', id: utilService.makeId(), isActive: false }
        ],
        cardOrder: ['members', 'status', 'date', 'workingDays', 'priority'],
        cards: [
            _createCard('New item', userId)
        ],
        style: { color: "#0085ff" }
    }
}