import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import { boardService } from '../../services/boardService';


export class GeneralUserInfo extends Component {
    state = {
        boards: null
    }

    async componentDidMount() {
        const { user } = this.props;
        const boards = await boardService.query(user._id);
        this.setState({ boards });
    }


    getActiveCards = () => {
        const { boards } = this.state;
        const { user } = this.props;
        const count = boards.reduce((acc, board) => {
            board.groups.forEach(group => {
                group.cards.forEach(card => {
                    card.members.forEach(memberId => {
                        if (memberId === user._id && card.status.text !== 'Done') {
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
                <div className="list-container boards-list">
                    <div className="list-title-container">
                        <h2>Boards</h2>
                        <DashboardOutlinedIcon />
                    </div>
                    <div className="list-items-container">
                        {!boards.length ? <h3>No boards to show</h3> :
                            boards.map(board => {
                                return <div key={board._id} className="info-row">
                                    <Link to={`/board/${board._id}`}>
                                        <span>{board.title}</span>
                                        <ArrowForwardOutlinedIcon />
                                    </Link>
                                </div>
                            })}
                    </div>
                </div>
                <div className="list-container active-cards-list">
                    <div className="list-title-container">
                        <h2>Active cards</h2>
                        <AssignmentOutlinedIcon />
                    </div>
                    <div className="list-items-container">
                        {!activeCards ? <h3>No active cards to show</h3> :
                            activeCards.map(card => {
                                return <div className="info-row" key={card.id}>
                                    <Link
                                        style={{ borderLeft: `7px solid ${card.status.color}` }}
                                        to={`/board/${card.boardId}/card/${card.id}`}
                                    >
                                        <span>{card.title}</span>
                                    </Link>
                                </div>
                            })}
                    </div>
                </div>
                <div className="list-container personal-info-list">
                    <div className="list-title-container">
                        <h2>Contact information</h2>
                        <AssignmentOutlinedIcon />
                    </div>
                    <div className="list-items-container">
                        <div className="info-row">
                            <a href={`mailto:${user.email}`}>
                                <AlternateEmailIcon />
                                <span>{user.email}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    }
}


// export const GeneralUserInfo = () => {
//     return (
//         <div>

//         </div>
//     )
// }


