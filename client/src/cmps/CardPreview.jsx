import React, { Component } from 'react'
import { Delete } from '@material-ui/icons';
import { DatePicker } from './DatePicker';
import { EditableElement } from './EditableElement';
import { LabelMenu } from './LabelMenu';
import { connect } from 'react-redux';
import {
    changeCardTitle,
    loadBoards,
    deleteCard,
    changeTaskMembers,
    changeCardDates,
    changeCardLabels,
    addCardLabel
} from '../store/actions/boardAction'
import ChatBubble from '../assets/img/ChatBubble.jsx';
import PersonIcon from '@material-ui/icons/Person';
import { utilService } from '../services/utilService.js'
import { TaskMembersModal } from './TaskMembersModal.jsx'
import { Draggable } from 'react-beautiful-dnd';
import { ProgressBar } from './ProgressBar';
import { ClickAwayListener } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { setMsg } from '../store/actions/userAction.js'
import { ConfirmModal } from './ConfirmModal.jsx'
class _CardPreview extends Component {
    state = {
        isShowMembers: false,
        isShowDate: false,
        isDelete: false
    }
    onChangeTitle = async (cardTitle) => {
        const { board, changeCardTitle, group, card, loggedInUser } = this.props
        await changeCardTitle({ board: { ...board }, groupId: group.id, cardToUpdate: card, cardTitle, user: loggedInUser })
    }
    onShowConfirmModal = () => {
        this.setState({ isDelete: true })
    }
    onDeleteCard = async (cardId, group) => {
        const { board, deleteCard, loggedInUser } = this.props
        await deleteCard({ groupId: group.id, board, cardId, user: loggedInUser })
        this.props.setMsg('Card  Successfully Removed')
    }
    changeTaskMembers = async (memberId, sign) => {
        const { changeTaskMembers, board, group, card, loggedInUser } = this.props
        await changeTaskMembers(memberId, sign, { ...board }, card, group.id, loggedInUser)
    }
    changeDates = async (dates) => {
        const { changeCardDates, board, group, card, loggedInUser } = this.props
        if (dates.startDate && dates.endDate) {
            changeCardDates(dates, { ...board }, group.id, card, loggedInUser)
        } else if (!dates.endDate) {
            changeCardDates(dates, { ...board }, group.id, card.id, loggedInUser)
        }
        this.closeDatePicker()
    }
    toggleMembersModal = () => {
        const { isShowMembers } = this.state;
        this.setState({ isShowMembers: !isShowMembers })
    }
    changeCardLabels = async (label, labelType) => {
        const { changeCardLabels, board, group, card, loggedInUser } = this.props
        await changeCardLabels({ ...board }, card, group.id, label, labelType, loggedInUser)
    }
    addCardLabel = async (label, labelGroup) => {
        const { addCardLabel, board, group } = this.props
        await addCardLabel({ ...board }, group.id, label, labelGroup)
    }
    closeDatePicker = () => {
        this.setState({ isShowDate: false })
    }
    checkWorkingDays = () => {
        const { endDate, startDate } = this.props.card.dueDate
        let days;
        let diff;
        if (startDate && !endDate) {
            if (new Date(startDate) < new Date()) return '--'
            diff = new Date(startDate) - new Date()
            days = Math.abs(Math.ceil(diff / (1000 * 60 * 60 * 24)))
        } else if (!endDate && !startDate) days = '--'
        else {
            diff = new Date(startDate) - new Date(endDate)
            days = Math.abs(Math.ceil(diff / (1000 * 60 * 60 * 24)))
        }
        return days
    }
    render() {
        const { card, group, board, idx } = this.props
        const boardMembers = board.members.filter(boardMember => {
            if (!card.members.length) return true;
            const mutualMember = card.members.find(member => {
                return member._id === boardMember._id
            });
            if (mutualMember) return false;
            return true;
        })
        const { isShowMembers, isShowDate } = this.state
        const cardMembersForDisplay = (card.members.length > 2) ? card.members.slice(0, 2) : card.members;
        return (
            <>
                <Draggable draggableId={card.id} index={idx}>
                    {(provided, snapshot) => (
                        <div className="card-preview"
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >
                            <div style={{ backgroundColor: group.style.color }}></div>
                            <div className="card-title">
                                <EditableElement onChangeTitle={this.onChangeTitle}>{card.title}</EditableElement>
                                <Delete onClick={this.onShowConfirmModal} />
                            </div>
                            <div><Link to={`/board/${board._id}/card/${card.id}`}><ChatBubble /></Link></div>
                            <div className="card-members relative" onClick={this.toggleMembersModal} >
                                {card.members.length >= 3 &&
                                    <span className="members-count-badge"> {`+${card.members.length - 2}`}</span>}
                                <div className={`flex justify-center align-center ${card.members.length >= 2 ? 'multiple-members-display' : ''}`}>
                                    {(!cardMembersForDisplay.length) && <PersonIcon className="member-empty-avatar" />}
                                    {
                                        cardMembersForDisplay.map((member) => (member.imgUrl) ?
                                            <img key={member._id} src={member.imgUrl} className="user-thumbnail" alt="" /> :
                                            <h5 style={{ backgroundColor: group.style.color }} key={member._id} className="user-thumbnail">
                                                {(utilService.getNameInitials(member.fullname).toUpperCase())}</h5>)
                                    }
                                </div>
                                {isShowMembers && <TaskMembersModal boardMembers={boardMembers} cardMembers={card.members}
                                    changeTaskMembers={this.changeTaskMembers} onCloseModal={this.toggleMembersModal} />}
                            </div>
                            <div className="card-status">{card.status.label}<LabelMenu onAddLabel={this.addCardLabel} enableAdding={true}
                                onSaveLabel={this.changeCardLabels} labelName={'status'} labelGroup="statuses" labels={group.statuses} currLabel={card.status} /></div>
                            <ClickAwayListener onClickAway={this.closeDatePicker}>
                                <div className="dateRange-container" onClick={() => this.setState({ isShowDate: true })}><ProgressBar startDate={card.dueDate.startDate}
                                    endDate={card.dueDate.endDate} status={card.status} createdAt={card.createdAt} groupColor={group.style.color} />
                                    {isShowDate && <DatePicker changeDates={this.changeDates}
                                        closeDatePicker={this.closeDatePicker} cardId={card.id} />}</div>
                            </ClickAwayListener>
                            <div className="card-workingDays">{this.checkWorkingDays()}</div>
                            <div className="card-priority"><LabelMenu onSaveLabel={this.changeCardLabels} enableAdding={false}
                                labelName={'priority'} labels={group.priorities} currLabel={card.priority} /></div>
                            <div className="card-closer"></div>
                        </div>
                    )}
                </Draggable>
                {this.state.isDelete && <ConfirmModal id={card.id} arg={group}
                    delete={this.onDeleteCard} close={() => this.setState({ isDelete: false })} title={card.title} type={'Card'} />}
            </>
        )
    }
}
const mapGlobalStateToProps = (state) => {
    return {
        loggedInUser: state.userReducer.loggedInUser,
        board:state.boardReducer.board
    }
}
const mapDispatchToProps = {
    changeCardTitle,
    deleteCard,
    loadBoards,
    changeTaskMembers,
    changeCardDates,
    changeCardLabels,
    addCardLabel,
    setMsg
}
export const CardPreview = connect(mapGlobalStateToProps, mapDispatchToProps)(_CardPreview);