import AddIcon from '@material-ui/icons/Add';
import { Component } from 'react'
import { BoardSearch } from './BoardSearch';
import { TextField } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { BoardSideBarItem } from './BoardSideBarItem';

export class BoardSideBar extends Component {

    state = {
        isAddBoard: false,
        boardTitle: '',
        isDelete: false,
        txt: ''
    }


    onInputChange = (ev) => {
        const value = ev.target.value;
        this.setState({ boardTitle: value });
    };

    onAddBoard = (ev) => {
        ev.preventDefault()
        if (!this.state.boardTitle) return
        this.props.onAddBoard(this.state.boardTitle)
        this.setState({ isAddBoard: false, boardTitle: '' })
    }

    toggleEditBoard = () => {
        this.setState({ isAddBoard: !this.state.isAddBoard });
    }

    render() {

        const { boards, onDeleteBoard, user, onSetFilter } = this.props;
        const { boardTitle } = this.state
        return (
            <section className="board-side-bar">
                <div className="main-workspace-title flex">
                    <span className="letter flex">
                        <span>M</span>
                        <HomeIcon />
                    </span>
                    <span>Main workspace</span>
                </div>
                <div className="board-sidebar-controlles">
                    <BoardSearch onSetFilter={onSetFilter} />
                    {!this.state.isAddBoard && <span className="board-sidebar-action-btn" onClick={this.toggleEditBoard}><AddIcon />Add</span>}
                    {this.state.isAddBoard &&
                        <form onSubmit={this.onAddBoard}>
                            <TextField placeholder=" Board Name" autoFocus type="text" autoComplete="off"
                                value={boardTitle} onChange={this.onInputChange} />
                        </form>
                    }
                </div>
                <div>
                    <h3 className="board-sidebar-title" >My boards</h3>
                    <div>
                        {boards.map((board, idx) => {
                            return <BoardSideBarItem
                                key={board._id}
                                idx={idx}
                                user={user}
                                board={board}
                                onDeleteBoard={onDeleteBoard}
                            />
                        })}
                    </div>
                </div>
            </section >

        )
    }
}
