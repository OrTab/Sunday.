import React, { useState } from 'react'
import { ConfirmModal } from './ConfirmModal';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

export const BoardSideBarItem = ({ board, onDeleteBoard, user, idx }) => {

    const [isInDeleteMode, setIsInDeleteMode] = useState(false)
    const currBoardId = useSelector(state => state.boardReducer.board?._id)

    return (
        !board || !currBoardId ? null : <div className={`board-sidebar-item ${board._id === currBoardId ? 'selected' : ''}`} >
            <Link to={`/board/${board._id}`}>{board.title}</Link>
            {(user._id === board.createdBy) && <DeleteIcon onClick={() => setIsInDeleteMode(true)} />}
            <ConfirmModal
                id={board._id}
                arg={idx}
                onApprove={onDeleteBoard}
                isInDeleteMode={isInDeleteMode}
                close={() => setIsInDeleteMode(false)}
                title={board.title}
                type={'Board'}
            />
        </div >
    )
}
