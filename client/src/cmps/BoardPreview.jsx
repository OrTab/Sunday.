import React, { Component } from 'react'
import { connect } from 'react-redux';
import { GroupPreview } from './GroupPreview';
import { BoardHeader } from './BoardHeader';
import {
    loadBoards, addCard, addGroup, changeBoardTitle, onChangeGroupTitle, changeBoardMemebrs,
    changeGroupColor, removeGroup, changeGroupIdx, changeCardIdx, getKeyById, onDragStart, onDragEnd
} from '../store/actions/boardAction.js'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { DashBoard } from './DashBoard';
import { boardService } from '../services/boardService'
import { setMsg } from '../store/actions/userAction.js';
export class _BoardPreview extends Component {
    state = {
        view: 'board',
        filterBy: null,
        onDrag: true,
        isDelete: false,
        board: this.props.board
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.board !== this.props.board) this.setState({ board: this.props.board })
        if (!prevProps.onDrag && this.props.onDrag) {
            if (this.state.filterBy) {
                const copyFilter = { ...this.state.filterBy }
                copyFilter.sortBy = '';
                this.setState({ filterBy: copyFilter, onDrag: true })
            }
        }
    }
    onAddCard = async (cardTitle, groupId) => {
        this.props.setMsg('Card Successfully Added')
        const { board, addCard, loggedInUser } = this.props
        await addCard({ cardTitle, groupId, board, user: loggedInUser })
    }
    onAddGroup = async () => {
        const { board, loggedInUser, addGroup } = this.props;
        await addGroup(board, loggedInUser);
    }
    //Board Title
    onChangeTitle = async (boardTitle) => {
        const { board, loggedInUser } = this.props
        await this.props.changeBoardTitle(boardTitle, board, loggedInUser)
    }
    //Group Title
    onChangeGroupTitle = async (groupTitle, groupId) => {
        const { board, onChangeGroupTitle, loggedInUser } = this.props
        await onChangeGroupTitle({ board: { ...board }, groupId, groupTitle, user: loggedInUser })
    }
    onChangeBoardMemebrs = async (memberData, type) => {
        const { changeBoardMemebrs, loggedInUser, board } = this.props;
        await changeBoardMemebrs(memberData, board, type, loggedInUser);
    }
    onChangeGroupColor = async (color, groupId) => {
        this.props.setMsg('Group color Successfully Change')
        const { changeGroupColor, board } = this.props;
        await changeGroupColor(color, board, groupId)
    }
    onRemoveGroup = async (group) => {
        const { removeGroup, board, loggedInUser } = this.props;
        await removeGroup(board, group, loggedInUser)
        this.props.setMsg('Group Successfully Removed')
    }
    onDragStart = () => {
        this.props.onDragStart()
    }
    onDragEnd = async (result) => {
        this.props.onDragEnd()
        const { destination, source, draggableId } = result
        if (!destination) return
        if (destination.droppableId === source.droppableId && destination.index === source.index || !destination.droppableId || !source.droppableId) return
        const { changeGroupIdx, changeCardIdx, board } = this.props
        if (result.type === 'group') {
            const boardToUpdate = await changeGroupIdx(board, result)
            this.setState({ board: boardToUpdate })
        }
        else {
            const boardToUpdate = JSON.parse(JSON.stringify(board))
            const sourceGroup = boardService.getKeyById(boardToUpdate, source.droppableId)
            var cardToAdd = boardService.getKeyById(sourceGroup, draggableId)
            const groups = boardToUpdate.groups.map(group => {
                if (group.id === source.droppableId && group.id !== destination.droppableId) {
                    group.cards.splice(source.index, 1)
                    return group
                } else if (group.id !== source.droppableId && group.id === destination.droppableId) {
                    if (!cardToAdd) {
                        cardToAdd = boardService.getKeyById(group, draggableId)
                    }
                    group.cards.splice(destination.index, 0, cardToAdd)
                    return group
                } else if (group.id === source.droppableId && group.id === destination.droppableId) {
                    group.cards = group.cards.map((card, idx, cards) => {
                        if (idx === source.index) return cards[destination.index]
                        if (idx === destination.index) return cards[source.index]
                        else return card
                    })
                    return group
                } else return group
            })
            boardToUpdate.groups = groups
            this.setState({ board: boardToUpdate })
            await changeCardIdx(boardToUpdate, result)
        }
    }
    changeBoardView = (ev) => {
        const { value } = ev.target
        if (value === 'dashboard') this.setState({ isShowDashboard: true })
        else this.setState({ isShowDashboard: false })
    }
    onSetFilter = (filterBy) => {
        this.setState({ filterBy })
    }
    getBoardForDisplay = () => {
        const { filterBy, board } = this.state
        var copyBoard = JSON.parse(JSON.stringify(board))
        if (filterBy) {
            if (filterBy.status.length) {
                copyBoard.groups = copyBoard.groups.filter(group => {
                    const filteredCards = group.cards.filter(card => {
                        const status = filterBy.status.find(label => {
                            return card.status.text === label
                        });
                        if (!status) return false
                        return true
                    })
                    if (filteredCards.length) {
                        group.cards = filteredCards
                        return true
                    }
                    return false
                })
            }
            if (filterBy.priority.length) {
                copyBoard.groups = copyBoard.groups.filter(group => {
                    const filteredCards = group.cards.filter(card => {
                        const priority = filterBy.priority.find(label => {
                            return card.priority.text === label
                        });
                        if (!priority) return false
                        return true
                    })
                    if (filteredCards.length) {
                        group.cards = filteredCards
                        return true
                    }
                    return false
                })
            }
            if (filterBy.membersId.length) {
                copyBoard.groups = copyBoard.groups.filter(group => {
                    const filteredCards = group.cards.filter(card => {
                        const member = card.members.find(member => {
                            return (filterBy.membersId.includes(member._id))
                        })
                        if (!member) return false
                        return true
                    })
                    if (filteredCards.length) {
                        group.cards = filteredCards
                        return true
                    }
                    return false
                })
            }
            if (filterBy.sortBy && !this.props.onDrag) {
                if (filterBy.sortBy === 'name') copyBoard.groups = boardService.sortByTitle(copyBoard.groups)
                else copyBoard.groups = boardService.sortByDate(copyBoard.groups)
            }
            const filterRegex = new RegExp(filterBy.txt, 'i');
            copyBoard.groups = copyBoard.groups.filter(group => {
                const filteredCards = group.cards.filter(card => filterRegex.test(card.title))
                if (filteredCards.length) {
                    group.cards = filteredCards
                    return true
                } else return false
                    || filterRegex.test(group.title)
            })
        }
        return copyBoard
    }
    render() {
        const { loggedInUser, onDrag, board } = this.props
        const { isShowDashboard } = this.state
        const filteredBoard = this.getBoardForDisplay()
        return (
            <>
                <BoardHeader user={loggedInUser} board={board} onAddGroup={this.onAddGroup} changeBoardView={this.changeBoardView} onChangeTitle={this.onChangeTitle}
                    onChangeBoardMemebrs={this.onChangeBoardMemebrs} onSetFilter={this.onSetFilter} />
                {isShowDashboard && <DashBoard board={board} />}
                {!isShowDashboard && <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                    <Droppable droppableId={board._id} isCombineEnabled type='group'>
                        {(provided) => (
                            <div className="main-groups-container" ref={provided.innerRef}
                                {...provided.droppableProps}>
                                {provided.placeholder}
                                <div className="groups-container flex column">
                                    {filteredBoard.groups.map((group, idx) => <GroupPreview
                                        key={group.id} group={group}
                                        onDrag={onDrag}
                                        onAddCard={this.onAddCard} board={board} onRemoveGroup={this.onRemoveGroup}
                                        onChangeGroupTitle={this.onChangeGroupTitle} onChangeGroupColor={this.onChangeGroupColor}
                                        idx={idx} />)}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>}
            </>
        )
    }
}
const mapGlobalStateToProps = (state) => {
    return {
        loggedInUser: state.userReducer.loggedInUser,
        onDrag: state.boardReducer.onDrag,
        board: state.boardReducer.board
    }
}
const mapDispatchToProps = {
    loadBoards,
    addCard,
    addGroup,
    changeBoardTitle,
    onChangeGroupTitle,
    changeBoardMemebrs,
    changeGroupColor,
    removeGroup,
    changeGroupIdx,
    changeCardIdx,
    getKeyById,
    setMsg,
    onDragStart,
    onDragEnd
}
export const BoardPreview = connect(mapGlobalStateToProps, mapDispatchToProps)(_BoardPreview)