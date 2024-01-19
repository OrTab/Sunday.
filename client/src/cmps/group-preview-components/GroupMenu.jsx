import React, { useState } from 'react'
import { ListItemIcon, MenuItem, MenuList, Popover } from '@material-ui/core';
import { changeGroupColor } from '../../store/actions/boardAction';
import { useDispatch, useSelector } from 'react-redux';
import { setMsg } from '../../store/actions/userAction';
import DeleteIcon from '@material-ui/icons/Delete';
import { GroupSortModal } from './GroupSortModal';
import { GroupColors } from './GroupColors';

export const GroupMenu = ({ groupId, onSetGroupSort, onShowConfirmModal, id, handleClose, anchorEl, open }) => {

    const dispatch = useDispatch()
    const board = useSelector(({ boardReducer }) => boardReducer.board)



    const onChangeGroupColor = async (color) => {
        dispatch(setMsg('Group color Successfully Change'))
        await dispatch(changeGroupColor(color, board, groupId))
        handleClose()
    }

    return (<>

        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <MenuList className="group-menu-container">
                <GroupColors onCloseAll={handleClose}
                    onChangeColor={onChangeGroupColor} />
                <MenuItem onClick={onShowConfirmModal}>
                    <ListItemIcon >
                        <DeleteIcon />
                    </ListItemIcon>
                    <span>Delete Group</span>
                </MenuItem>
                <GroupSortModal onSetGroupSort={onSetGroupSort} />
            </MenuList>
        </Popover>
    </>
    )
}
