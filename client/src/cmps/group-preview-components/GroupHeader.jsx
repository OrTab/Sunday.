import React, { useState } from 'react'
import { ConfirmModal } from '../ConfirmModal'
import { GroupMenu } from './GroupMenu'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { EditableElement } from '../EditableElement';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import { Draggable, Droppable } from 'react-beautiful-dnd';

export const GroupHeader = ({ group, color, onSetGroupSort, provided, onChangeTitle, onRemoveGroup }) => {
    const [isInDeleteMode, setIsInDeleteMode] = useState(false)
    const [isMenuOnHover, setIsMenuOnHover] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);

    const getCardOrder = (cardOrder, provided, snapshot) => {

        switch (cardOrder) {

            case 'members': {
                return <div
                    className={`card-members-cell ${snapshot.isDragging ? 'group-header-drag' : ''}`}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}><h4>Members</h4>
                </div >
            }
            case 'date': {
                return <div
                    className={`card-cell ${snapshot.isDragging ? 'group-header-drag' : ''}`}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}>
                    <h4>Date range</h4>
                </div>
            }
            case 'workingDays': {
                return <div
                    className={`card-cell ${snapshot.isDragging ? 'group-header-drag' : ''}`}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}><h4>Working Days</h4>
                </div >
            }
            case 'priority': {
                return <div
                    className={`card-cell ${snapshot.isDragging ? 'group-header-drag' : ''}`}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}><h4>Priority</h4>
                </div >


            }
            case 'status': {
                return <div
                    className={`card-cell ${snapshot.isDragging ? 'group-header-drag' : ''}`}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}><h4>Status</h4>
                </div >
            }
        }
    }
    const handleClick = (ev) => {
        setAnchorEl(ev.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'group-menu-popover' : undefined;

    return (<>
        <ArrowDropDownOutlinedIcon
            onMouseEnter={() => setIsMenuOnHover(true)}
            onMouseLeave={() => setIsMenuOnHover(false)}
            aria-describedby={id}
            onClick={handleClick}
            className="group-menu-icon" style={{
                backgroundColor: isMenuOnHover ? '#f9f9f9' : color,
                color: !isMenuOnHover ? '#f9f9f9' : color,
                border: `1px solid ${color}`
            }}
        />
        <div className="group-header">
            <GroupMenu
                id={id}
                anchorEl={anchorEl}
                open={open}
                groupId={group.id}
                onSetGroupSort={onSetGroupSort}
                handleClose={handleClose}
                onShowConfirmModal={() => setIsInDeleteMode(true)}
                setIsInDeleteMode={setIsInDeleteMode}
                color={color}
            />
            {isInDeleteMode && <ConfirmModal
                id={group}
                onApprove={onRemoveGroup}
                isInDeleteMode={isInDeleteMode}
                close={() => setIsInDeleteMode(false)}
                title={group.title}
                type={'Group'}
            />}
            <div className="drag-icon" {...provided.dragHandleProps}>
                <DragIndicatorIcon />
            </div>
            <h2 className="group-header-title" style={{ color }}>
                <EditableElement onChangeTitle={onChangeTitle}>
                    {group.title}
                </EditableElement>
            </h2>
            <Droppable droppableId={`group-${group.id}`} type="group-header" direction="horizontal">
                {provided => (
                    <div className="droppable-group-header"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {group.cardOrder.map((cardOrder, idx) => {
                            return <Draggable key={cardOrder} draggableId={cardOrder + '-' + group.id} index={idx}>
                                {(provided, snapshot) => (
                                    getCardOrder(cardOrder, provided, snapshot)
                                )}

                            </Draggable>
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    </>
    )
}
