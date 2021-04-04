import React, { Component } from 'react'
import { connect } from 'react-redux';
import RemoveIcon from '@material-ui/icons/Remove';
import { Link } from 'react-router-dom'
import { utilService } from '../services/utilService.js';
import { ClickAwayListener } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { query } from '../store/actions/userAction'
import { BoardSearch } from './BoardSearch.jsx';

class _BoardMembers extends Component {

    state = {
        users: []
    }

    onSetFilter = async (txt) => {
        if (!txt) {
            this.setState({ users: [] })
            return;
        }
        const { board, query } = this.props
        const users = await query(txt);
        const usersNotInBoard = users.filter(user => {
            // if (!board.members.length) return true;
            const mutualMember = board.members.find(member => member._id === user._id);
            if (mutualMember) return false;
            return true;
        })

        this.setState({ users: usersNotInBoard })
    }

    onChangeBoardMemebrs = (userToUpdate, sign) => {
        const { users } = this.state
        const updatedUsers = users.filter(user => user._id !== userToUpdate._id)
        this.setState({ users: updatedUsers }, () => {
            this.props.onChangeBoardMemebrs(userToUpdate, sign)
        })
    }




    render() {
        const { board, onChangeBoardMemebrs, onCloseModalMembers } = this.props;
        const { users } = this.state;
        return <ClickAwayListener onClickAway={onCloseModalMembers}>
            <div className="members-modal-basic" >
                <div>
                    <h3>Add users to this board</h3>
                    <div>
                        <BoardSearch onSetFilter={this.onSetFilter} />
                    </div>
                    {users.map(user => {
                        return <div key={user._id} className="flex align-center space-between member-row" >
                            <Link to={`/user/${user._id}/general`} >
                                <div className="flex align-center space-between">
                                    {user.imgUrl ? <img src={user.imgUrl} className="user-thumbnail" alt="" /> :
                                        <span className="user-thumbnail">{utilService.getNameInitials(user.fullname)}</span>}
                                    <span className="modal-user-full-name">{user.fullname}</span>
                                </div>
                            </Link>
                            <AddIcon onClick={() => this.onChangeBoardMemebrs(user, 'add')} className="remove-icon" />
                        </div>
                    })}
                </div>
                <div>
                    <h3>Board Members</h3>
                    {board.members.map(member => {
                        return <div key={member._id} className="flex align-center space-between member-row" >
                            <Link to={`/user/${member._id}/general`} >
                                <div className="flex align-center space-between">
                                    {member.imgUrl ? <img src={member.imgUrl} className="user-thumbnail" alt="" /> :
                                        <span className="user-thumbnail">{utilService.getNameInitials(member.fullname)}</span>}
                                    <span className="modal-user-full-name">{member.fullname}</span>
                                </div>
                            </Link>
                            <RemoveIcon onClick={() => onChangeBoardMemebrs(member._id, 'remove')} className="remove-icon" />
                        </div>
                    })}
                </div>
            </div>
        </ClickAwayListener>
    }
}


const mapGlobalStateToProps = (state) => {
    return {
        loggedInUser: state.userReducer.loggedInUser,
    }
}
const mapDispatchToProps = {
    query
}

export const BoardMembers = connect(mapGlobalStateToProps, mapDispatchToProps)(_BoardMembers)

