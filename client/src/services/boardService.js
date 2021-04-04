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
    addCardUpdate

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

    let currBoardId = (!boardIdx && boards.length) ? boards[boardIdx]._id : boards[boardIdx - 1]?._id
    return currBoardId
}



async function addBoard(boardTitle, user) {
    try {
        const boardToAdd = {
            title: boardTitle,
            createdBy: {},
            members: [],
            activities: [],
            groups: [_createDefaultGroup(user)]
        }
        // return await storageService.post('boards', boardToAdd)
        return httpService.post('board', boardToAdd)
    } catch (err) {
        throw err

    }
}

function _findGroupById(board, groupId) {
    const group = board.groups.find(group => groupId === group.id)
    return group
}

async function addCard({ board, groupId, cardTitle, user }) {
    try {
        const boardToUpdate = JSON.parse(JSON.stringify(board))
        const groupToUpdate = _findGroupById(boardToUpdate, groupId)
        const activityText = `added a new card : ${cardTitle}, to group : ${groupToUpdate.title}`
        const activity = _createBoardActivity(user, activityText)
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]
        groupToUpdate.cards = [...groupToUpdate.cards, (_createCard(cardTitle, user))]
        const groups = boardToUpdate.groups.map(group => group.id === groupToUpdate.id ? groupToUpdate : group)
        boardToUpdate.groups = groups
        httpService.put('board', boardToUpdate)
        return boardToUpdate
    } catch (err) {
        throw err
    }

}

async function addGroup(board, user) {
    try {
        const activityText = `added a new group`
        const activity = _createBoardActivity(user, activityText)
        const boardToUpdate = JSON.parse(JSON.stringify(board))
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]
        const newGroup = _createDefaultGroup(user);
        boardToUpdate.groups = [newGroup, ...boardToUpdate.groups]
         httpService.put('board', boardToUpdate)
        return boardToUpdate
    } catch (err) {
        throw err
    }
}

async function deleteCard({ board, groupId, cardId, user }) {
    try {
        const boardToUpdate = JSON.parse(JSON.stringify(board))
        const groupToUpdate = _findGroupById(boardToUpdate, groupId)
        const activityText = `deleted a card in group : ${groupToUpdate.title}`
        const activity = _createBoardActivity(user, activityText)
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]

        const cards = groupToUpdate.cards.filter(card => card.id !== cardId)
        groupToUpdate.cards = cards
        const groups = boardToUpdate.groups.map(group => group.id === groupToUpdate.id ? groupToUpdate : group)
        boardToUpdate.groups = groups

         httpService.put('board', boardToUpdate)
        return boardToUpdate
    } catch (err) {
        throw err
    }
}

async function changeBoardTitle(newTitle, board, user) {

    const boardToUpdate = JSON.parse(JSON.stringify(board))
    const activityText = `changed board title from '${boardToUpdate.title}' to '${newTitle}'`
    const activity = _createBoardActivity(user, activityText)
    boardToUpdate.activities = [activity, ...boardToUpdate.activities]
    boardToUpdate.title = newTitle
     httpService.put('board', boardToUpdate)
    return boardToUpdate
}

function sortByTitle(groupsToSort) {
    groupsToSort = groupsToSort.sort((group1, group2) => {
        if (group1.title.toLowerCase() > group2.title.toLowerCase()) return 1
        else if (group1.title.toLowerCase() < group2.title.toLowerCase()) return -1;
        else return 0;
    })
    return groupsToSort
}

function sortByDate(groupsToSort) {
    groupsToSort = groupsToSort.sort((group1, group2) => {
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
        const boardToUpdate = JSON.parse(JSON.stringify(board))
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
    const { destination, source } = result
    try {
        const boardToUpdate = JSON.parse(JSON.stringify(board))
        const newGroups = boardToUpdate.groups.map((group, idx, groups) => {
            if (idx === source.index) return groups[destination.index]
            if (idx === destination.index) return groups[source.index]
            else return group
        })
        boardToUpdate.groups = newGroups;
        httpService.put('board', boardToUpdate)
        return boardToUpdate
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
        const boardToUpdate = JSON.parse(JSON.stringify(board))
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

function updateTaskMembers(memberId, sign, board, cardToUpdate, groupId, user) {
    try {
        const boardToUpdate = JSON.parse(JSON.stringify(board))
        const groupToUpdate = _findGroupById(boardToUpdate, groupId)
        const member = boardToUpdate.members.find(member => member._id === memberId)
        var cards;
        var activityText;
        var notificationTxt;

        if (sign === 'remove') {
            activityText = `removed ${member.fullname} from card '${cardToUpdate.title}' `
            if (memberId !== user._id) notificationTxt = `${user.fullname} removed you from card '${cardToUpdate.title}' in group : ${groupToUpdate.title}`
            cards = groupToUpdate.cards.map(card => {
                if (cardToUpdate.id === card.id) {
                    const members = card.members.filter(member => memberId !== member._id)
                    card.members = members
                    return card
                } else return card
            })
        }
        else {
            activityText = `added ${member.fullname} to card '${cardToUpdate.title}'`
            if (memberId !== user._id) notificationTxt = `${user.fullname} added you to card '${cardToUpdate.title}' in group : ${groupToUpdate.title}`
            cards = groupToUpdate.cards.map(card => {
                if (cardToUpdate.id === card.id) {
                    const members = [...card.members, member]
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
        if (notificationTxt) return { member, notificationTxt, user }
    } catch (err) {
        throw err
    }

}
function changeBoardMemebrs(memberData, board, type, user) {

    const boardToUpdate = JSON.parse(JSON.stringify(board));
    var activityText;
    var notificationTxt;
    var member


    if (type === 'remove') {
        const membersToRemove = boardToUpdate.members.find(member => member._id === memberData)
        if (memberData !== user._id) notificationTxt = `${user.fullname} remove you from '${board.title}' `
        member = boardToUpdate.members.find(member => member._id === memberData)
        activityText = `removed ${membersToRemove.fullname} from this board`
        boardToUpdate.members = boardToUpdate.members.filter(member => member._id !== memberData)
        boardToUpdate.groups = boardToUpdate.groups.map(group => {
            group.cards = group.cards.map(card => {
                card.members = card.members.filter(member => member._id !== memberData);
                return card
            })
            return group;
        })

    } else {
        activityText = `added ${memberData.fullname} to this board`
        if (memberData._id !== user._id) notificationTxt = `${user.fullname} add you to '${board.title}'`
        member = { ...memberData }
        const newMembers = [...boardToUpdate.members, memberData];
        boardToUpdate.members = newMembers
    }
    const activity = _createBoardActivity(user, activityText)
    boardToUpdate.activities = [activity, ...boardToUpdate.activities]
    httpService.put('board', boardToUpdate)
    if (notificationTxt) return { member, notificationTxt, user }
    // if (notificationTxt) return { member: user, notificationTxt, user: memberData }

}

async function changeCardLabels(board, cardToUpdate, groupId, label, labelType, user) {
    try {
        const boardToUpdate = JSON.parse(JSON.stringify(board))
        const groupToUpdate = _findGroupById(boardToUpdate, groupId)
        const activityText = `updated ${labelType} in card '${cardToUpdate.title}' from '${cardToUpdate[labelType].text}' to '${label.text}'`
        const activity = _createBoardActivity(user, activityText)
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]

        const cards = groupToUpdate.cards.map(card => {
            if (cardToUpdate.id === card.id) {
                card[labelType] = label;
                return card
            } else return card
        })
        groupToUpdate.cards = cards
        const groups = boardToUpdate.groups.map(group => group.id === groupToUpdate.id ? groupToUpdate : group)
        boardToUpdate.groups = groups
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
        // console.log(err);
    }
}


async function addCardLabel(board, groupId, label, labelGroup) {
    try {
        const groups = board.groups.map(group => {
            if (group.id === groupId) {
                const groupToUpdate = { ...group }
                groupToUpdate[labelGroup] = [...groupToUpdate[labelGroup], label];
                return groupToUpdate;
            } else return group;
        })
        board.groups = groups
         httpService.put('board', board)
        return board
    } catch (err) {
        throw err
    }
}

async function changeCardTitle({ board, groupId, cardToUpdate, cardTitle, user }) {
    try {
        const boardToUpdate = JSON.parse(JSON.stringify(board))
        const groupToUpdate = _findGroupById(boardToUpdate, groupId)
        const activityText = `changed card title from ${cardToUpdate.title} to ${cardTitle}`
        const activity = _createBoardActivity(user, activityText)
        boardToUpdate.activities = [activity, ...boardToUpdate.activities]


        const cards = groupToUpdate.cards.map(card => {
            if (card.id === cardToUpdate.id) {
                card.title = cardTitle
                return card
            } else return card
        })
        groupToUpdate.cards = cards
        const groups = boardToUpdate.groups.map(group => group.id === groupToUpdate.id ? groupToUpdate : group)
        boardToUpdate.groups = groups
        // return await storageService.put('boards', board)
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
        "id": utilService.makeId(),
        txt,
        isRead: false,
        "createdAt": Date.now(),
        "byMember": {
            "_id": user._id,
            "fullname": user.fullname,
            "imgUrl": user.imgUrl ? user.imgUrl : null
        }
    }

}



function _createCard(cardTitle, user) {
    return {
        id: utilService.makeId(),
        title: cardTitle,
        updates: [],
        members: [
            {
                "_id": user._id,
                "fullname": user.fullname,
                "imgUrl": user.imgUrl ? user.imgUrl : null
            }
        ],
        status:
            { text: 'No status yet', color: '#cccccc', id: utilService.makeId() },
        priority:
            { text: 'Set priority', color: '#cccccc', id: utilService.makeId() },
        createdAt: Date.now(),
        dueDate: {
            startDate: '',
            endDate: ''
        },
        createdBy: {
            _id: user._id,
            fullname: user.fullname,
            imgUrl: user.imgUrl ? user.imgUrl : null
        },
    }
}

function _createDefaultGroup(user) {
    return {
        id: utilService.makeId(),
        title: "New group",
        createdBy: {
            "_id": user._id,
            "fullname": user.fullname,
            "imgUrl": user.imgUrl ? user.imgUrl : null
        },
        createdAt: Date.now(),
        statuses: [
            { text: 'Done', color: '#00ca72', id: utilService.makeId() },
            { text: 'Stuck', color: '#fb275d', id: utilService.makeId() },
            { text: 'Working on it', color: '#ffcc00', id: utilService.makeId() }
        ],
        priorities: [
            { text: 'Low', color: '#6bf1b9', id: utilService.makeId() },
            { text: 'Medium', color: '#6b97f1', id: utilService.makeId() },
            { text: 'High', color: '#ff812f', id: utilService.makeId() },
            { text: 'Urgent', color: '#ff2f2f', id: utilService.makeId() }
        ],
        cards: [
            _createCard('New item', user)
        ],
        style: { color: "#0085ff" }
    }
}