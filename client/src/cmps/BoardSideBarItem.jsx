import React, { useState } from 'react'
import { ConfirmModal } from './ConfirmModal';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom'

export const BoardSideBarItem = ({ board, onDeleteBoard, user, idx }) => {

    const [isDelete, setIsDelete] = useState(false)

    return (
        <div className="board-sidebar-row">
            <Link to={`/board/${board._id}`}>{board.title}</Link>
            {(user._id === board.createdBy._id) && <DeleteIcon onClick={() => setIsDelete(true)} />}
            {isDelete && <ConfirmModal id={board._id} arg={idx}
                delete={onDeleteBoard} close={() => setIsDelete(false)} title={board.title} type={'Board'} />}
        </div>
    )
}
