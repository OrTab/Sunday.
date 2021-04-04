import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getBoardsByUserId } from '../../store/actions/boardAction'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';


export class _GeneralUserInfo extends Component {
    state = {
        boards: null
    }

    async componentDidMount() {
        const { user } = this.props;
        const boards = await this.props.getBoardsByUserId(user._id);
        this.setState({ boards });
    }


    getActiveCards = () => {
        const { boards } = this.state;
        const { user } = this.props;
        // const count = boardService.deepSearchByKey(boards, user._id)
        const count = boards.reduce((acc, board) => {
            board.groups.forEach(group => {
                group.cards.forEach(card => {
                    card.members.forEach(member => {
                        if (member._id === user._id && card.status.text !== 'Done') {
                            const activeCard = {
                                id: card.id,
                                title: card.title,
                                status: card.status,
                                boardId: board._id
                            }
                            acc.push(activeCard);
                        }
                    })
                })
            })
            return acc;
        }, [])
        return count;
    }



    render() {
        const { user } = this.props;
        const { boards } = this.state;
        if (!boards) return null;
        const activeCards = this.getActiveCards();
        return <div className="general-container">
            <div className="general-inner-container">
                <div className="users-boards-list">
                    <div>
                        <h2>Boards</h2>
                        <DashboardOutlinedIcon />
                    </div>
                    <div>
                        {!boards.length ? <h3>No boards to show</h3> :
                            boards.map(board => {
                                return <div key={board._id} className="users-boards-list-row">
                                    <Link to={`/board/${board._id}`}><span>{board.title}</span> <ArrowForwardOutlinedIcon /> </Link>
                                </div>
                            })}
                    </div>
                </div>
                <div className="active-items-container">
                    <div>
                        <h2>Active cards</h2>
                        <AssignmentOutlinedIcon />
                    </div>
                    <div>
                        {!activeCards ? <h3>No active cards to show</h3> :
                            activeCards.map(card => {
                                return <Link key={card.id} to={`/board/${card.boardId}/card/${card.id}`}> <div style={{ borderLeft: `7px solid ${card.status.color}` }}
                                    className="active-items-list-row">
                                    <h3>{card.title}</h3>
                                </div></Link>
                            })}
                    </div>
                </div>
                <div className="personal-info-container">
                    <div>
                        <h2>Contact information</h2>
                        <AssignmentOutlinedIcon />
                    </div>
                    <div>
                        <div className="personal-info-icon-row">
                            <a href="mailto:email@example.com">
                                <AlternateEmailIcon />
                                <h3>{user.email}</h3>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}


const mapGlobalStateToProps = (state) => {
    return {
    }
}
const mapDispatchToProps = {
    getBoardsByUserId
}


export const GeneralUserInfo = connect(mapGlobalStateToProps, mapDispatchToProps)(_GeneralUserInfo);



