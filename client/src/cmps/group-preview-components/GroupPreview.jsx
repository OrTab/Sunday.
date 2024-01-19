import { CardPreview } from "../CardPreview";
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { boardService } from "../../services/boardService";
import ReactTooltip from "react-tooltip";
import { utilService } from "../../services/utilService";
import { GroupHeader } from "./GroupHeader";
import { useDispatch, useSelector } from "react-redux";

// componentDidUpdate(prevProps, prevState) {
//     if (!prevProps.onDrag && props.onDrag) setState({ sortGroupBy: '' })
// }

export const GroupPreview = ({ onAddCard, group, onChangeGroupTitle, onDrag, onDeleteCard, onRemoveGroup, idx }) => {

    const [cardTitle, setCardTitle] = useState('')
    const [placeholder, setPlaceholder] = useState('+ Add')
    const [sortGroupBy, setSortGroupBy] = useState('')
    const isScroll = useSelector((state) => state.boardReducer.isScroll)
    const dispatch = useDispatch()
    const timeoutId = useRef(null)

    useEffect(() => {

        return () => {
            clearTimeout(timeoutId.current)
        }
    }, [])

    const handleChange = (ev) => {
        const { value } = ev.target
        setCardTitle(() => value)
    }

    const handleAddCardSubmit = (ev) => {
        ev.preventDefault()
        if (!cardTitle || !cardTitle.replace(/\s/g, '').length) {
            setPlaceholder(() => 'Activity required')
            setCardTitle(() => '')
            setTimeout(() => setPlaceholder(() => '+Add Activity'), 1000)
            return
        }
        onAddCard(cardTitle, group.id)
        setCardTitle(() => '')
    }

    const onChangeTitle = (groupTitle) => {
        onChangeGroupTitle(groupTitle, group.id)
    }

    const handleScroll = () => {
        clearTimeout(timeoutId.current)
        if (!isScroll) dispatch({ type: 'GROUP_SCROLL', isScroll: true })
        timeoutId.current = setTimeout(() => {
            dispatch({ type: 'GROUP_SCROLL', isScroll: false })
        }, 200)
    }

    const groupForDisplay = useMemo(() => {
        if (onDrag) return group
        else {
            const groupCopy = JSON.parse(JSON.stringify(group))
            let cards;
            if (sortGroupBy && !onDrag) {
                if (sortGroupBy === 'name') cards = boardService.sortByTitle(groupCopy.cards)
                else cards = boardService.sortCardByDate(groupCopy.cards)
                groupCopy.cards = cards
            }
            return groupCopy
        }
    }, [sortGroupBy, group, onDrag])

    const countStatus = useMemo(() => {
        const group = groupForDisplay
        const statusCount = group.cards.reduce((acc, card) => {
            // acc[card.status.text] = acc[card.status.text] ? acc[card.status.text] + 1 : 1;
            const { color, text } = card.status
            acc[text] = acc[text] ?
                { color, count: acc[text].count + 1 } : { color, count: 1 };
            return acc;
        }, {})

        // Object.keys(statusCount).forEach(key => {
        //     // if (key === 'No status yet') statusCount[key].count = 0
        //     statusCount[key].count = Math.round((statusCount[key].count / group.cards.length) * 100);
        // })
        return statusCount
    }, [groupForDisplay])

    // const statusCount = countStatus
    const { color } = groupForDisplay.style;
    return (
        <Draggable draggableId={groupForDisplay.id} index={idx}>
            {(provided) => (
                <div className="group-container flex column"
                    onScroll={handleScroll}
                    {...provided.draggableProps}
                    ref={provided.innerRef}>
                    <GroupHeader
                        color={color}
                        onSetGroupSort={(sortBy) => setSortGroupBy(sortBy)}
                        onRemoveGroup={onRemoveGroup}
                        group={groupForDisplay}
                        provided={provided}
                        onChangeTitle={onChangeTitle}
                    />
                    <Droppable droppableId={groupForDisplay.id} isCombineEnabled type='card'>
                        {(provided) => (
                            <div
                                className="group-droppable"
                                {...provided.dragHandleProps}
                                {...provided.droppableProps}
                                ref={provided.innerRef}>
                                {groupForDisplay.cards.map((card, idx) => {
                                    return (
                                        <CardPreview
                                            key={card.id}
                                            card={card}
                                            idx={idx}
                                            group={groupForDisplay}
                                            onDeleteCard={onDeleteCard}
                                        />
                                    )
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <div className="group-bottom-section-input">
                        <div className="card-cell-small" style={{ backgroundColor: `${color}66` }}></div>
                        <form onSubmit={handleAddCardSubmit}>
                            <input
                                className="add-card-input"
                                type="text"
                                placeholder={placeholder}
                                name="activity"
                                autoComplete="off"
                                value={cardTitle}
                                onChange={handleChange}
                            />
                            <button type="submit" className="add-card-btn">Add</button>
                        </form>
                        <div className="card-cell-small" style={{ backgroundColor: '#E6E9EF' }}></div>
                    </div>
                    <div className="group-bottom-section-utils flex">
                        <h5>Statuses :</h5>
                        <div className="progress-status">
                            {Object.keys(countStatus).map((key, idx) => {
                                const id = utilService.makeId()
                                return < div
                                    key={idx}
                                    style={{ width: Math.round((countStatus[key].count / group.cards.length) * 100) + '%', background: countStatus[key].color }}
                                    data-tip data-for={id}
                                >
                                    <ReactTooltip
                                        className="sunday-tooltip"
                                        id={id}
                                        place="bottom"
                                        effect="solid"
                                    >
                                        <span className="tool-tip-txt">
                                            {`${key} ${Math.round((countStatus[key].count / group.cards.length) * 100)}% ${countStatus[key].count}/${group.cards.length}`}
                                        </span>
                                    </ReactTooltip>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            )
            }
        </Draggable>
    )
}
