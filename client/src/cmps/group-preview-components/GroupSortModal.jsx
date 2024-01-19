import { ListItemIcon, MenuItem, MenuList, Popover } from '@material-ui/core'
import SortIcon from '@material-ui/icons/Sort';
import React, { useState } from 'react'

export const GroupSortModal = ({ onSetGroupSort }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (ev) => {
        setAnchorEl(ev.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'group-sort-modal-popover' : undefined;
    return (
        <>
            <MenuItem aria-describedby={id} onClick={handleClick}>
                <ListItemIcon >
                    <SortIcon className="group-modal-icon" />
                </ListItemIcon>
                <span>Sort By</span>
            </MenuItem>
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
                    horizontal: 'left',
                }}
            >
                <MenuList className="group-sort-modal">
                    <MenuItem onClick={() => onSetGroupSort('date')}>
                        <ListItemIcon>
                            <span>Date</span>
                        </ListItemIcon>
                    </MenuItem>
                    <MenuItem onClick={() => onSetGroupSort('name')}>
                        <ListItemIcon >
                            <span>Name</span>
                        </ListItemIcon>
                    </MenuItem>
                </MenuList>
            </Popover></>
    )
}
