import React, { useMemo, useState } from "react";
import { Delete } from "@material-ui/icons";
import { DatePicker } from "./DatePicker";
import { EditableElement } from "./EditableElement";
import { LabelMenu } from "./LabelMenu";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCardTitle,
  deleteCard,
  changeTaskMembers,
  changeCardDates,
  changeCardLabels,
  deleteLabel,
  addCardLabel,
} from "../store/actions/boardAction";
import ChatBubble from "../assets/img/ChatBubble.jsx";
import PersonIcon from "@material-ui/icons/Person";
import { TaskMembersModal } from "./TaskMembersModal.jsx";
import { Draggable } from "react-beautiful-dnd";
import { ProgressBar } from "./ProgressBar";
import { ClickAwayListener } from "@material-ui/core";
import { Link } from "react-router-dom";
import { setMsg } from "../store/actions/userAction.js";
import { ConfirmModal } from "./ConfirmModal.jsx";
import { MemberForDisplay } from "./members-components/MemberForDisplay";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

export const CardPreview = ({ idx, group, card }) => {
  const [areMembersShown, setAreMembersShown] = useState(false);
  const [isDateShown, setIsDateShown] = useState(false);
  const [isInDeleteMode, setIsInDeleteMode] = useState(false);
  const { boardMembers, isScroll, board } = useSelector(
    ({ boardReducer }) => boardReducer
  );
  const loggedInUser = useSelector((state) => state.userReducer.loggedInUser);
  const dispatch = useDispatch();

  const onChangeTitle = async (cardTitle) => {
    await dispatch(
      changeCardTitle({
        board,
        groupId: group.id,
        cardToUpdate: card,
        cardTitle,
        user: loggedInUser,
      })
    );
  };

  const onDeleteCard = async (cardId, group) => {
    await dispatch(
      deleteCard({ groupId: group.id, board, cardId, user: loggedInUser })
    );
    dispatch(setMsg("Card Successfully Removed"));
  };

  const onChangeTaskMembers = (member, sign) => {
    dispatch(
      changeTaskMembers(member, sign, board, card, group.id, loggedInUser)
    );
  };

  const onChangeCardDates = (dates) => {
    if (dates.startDate && dates.endDate) {
      dispatch(changeCardDates(dates, board, group.id, card, loggedInUser));
    } else if (!dates.endDate) {
      dispatch(changeCardDates(dates, board, group.id, card, loggedInUser));
    }
    closeDatePicker();
  };

  const onDeleteLabel = (labelId, { labelGroup, labelType }) => {
    let label;
    if (labelType === "priority")
      label = { text: "Set priority", color: "#cccccc", id: Math.random() };
    else label = { text: "No status yet", color: "#cccccc", id: Math.random() };
    dispatch(
      deleteLabel({
        board,
        groupId: group.id,
        labelId,
        labelGroup,
        cardDetails: { cardId: card.id, labelType, label },
      })
    );
  };

  const onChangeCardLabels = (label, labelGroup, labelType) => {
    dispatch(
      changeCardLabels({
        board,
        cardToUpdate: card,
        groupId: group.id,
        label,
        labelType,
        user: loggedInUser,
        labelGroup,
      })
    );
  };

  const onAddCardLabel = (label, labelGroup) => {
    dispatch(addCardLabel(board, group.id, label, labelGroup));
  };

  const closeDatePicker = () => {
    setIsDateShown(false);
  };

  const workingDays = useMemo(() => {
    const { endDate, startDate } = card.dueDate;
    let days;
    let diff;
    if (startDate && !endDate) {
      if (new Date(startDate) < new Date()) {
        diff = new Date(startDate) - new Date(card.createdAt);
        days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days <= 0) return "--";
        days = Math.abs(days);
      } else {
        diff = new Date(startDate) - new Date();
        days = Math.abs(Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }
    } else if (!endDate && !startDate) days = "--";
    else {
      diff = new Date(startDate) - new Date(endDate);
      days = Math.abs(Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    return days;
  }, [card.dueDate]);

  const { availableBoardMembers, cardMembers } = useMemo(() => {
    const availableBoardMembers = [];
    const cardMembers = [];
    boardMembers.forEach((boardMember) => {
      // if (!card.members.length) return true;
      const mutualMember = card.members.find(
        (cardMemberId) => cardMemberId === boardMember._id
      );
      if (!mutualMember) availableBoardMembers.push(boardMember);
      else {
        cardMembers.push(boardMember);
      }
    });
    return { availableBoardMembers, cardMembers };
  }, [boardMembers, card.members]);

  const cardMembersForDisplay =
    cardMembers.length > 2 ? cardMembers.slice(0, 2) : cardMembers;

  return (
    <>
      <Draggable draggableId={card.id} index={idx}>
        {(provided, snapshot) => (
          <div
            className='card-preview'
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {/* <div className="" {...provided.dragHandleProps}>
                            <DragIndicatorIcon />
                        </div> */}
            <div
              className='card-color-div card-cell-small'
              style={{ backgroundColor: group.style.color }}
            ></div>
            <div className='card-title'>
              <EditableElement onChangeTitle={onChangeTitle}>
                {card.title}
              </EditableElement>
              <Delete onClick={() => setIsInDeleteMode(true)} />
            </div>
            <div className='card-members-cell'>
              <Link to={`/board/${board._id}/card/${card.id}`}>
                <ChatBubble />
              </Link>
            </div>
            {group.cardOrder.map((cardOrder, idx) => {
              if (idx === group.cardOrder.length - 1) {
                var isLast =
                  group.cardOrder[idx] === "status" ||
                  group.cardOrder[idx] === "priority";
              }
              switch (cardOrder) {
                case "members": {
                  return (
                    <div
                      key={cardOrder}
                      className='card-members relative card-members-cell'
                      onClick={() => setAreMembersShown(!areMembersShown)}
                    >
                      {card.members.length >= 3 && (
                        <span className='members-count-badge'>
                          {`+${card.members.length - 2}`}
                        </span>
                      )}
                      <div
                        className={`flex justify-center align-center ${
                          card.members.length >= 2
                            ? "multiple-members-display"
                            : ""
                        }`}
                      >
                        {!cardMembersForDisplay.length && (
                          <PersonIcon className='member-empty-avatar' />
                        )}
                        {cardMembersForDisplay.map((member) => (
                          <MemberForDisplay
                            key={member._id}
                            backgroundColor={group.style.backgroundColor}
                            member={member}
                          />
                        ))}
                      </div>
                      {areMembersShown && (
                        <TaskMembersModal
                          availableBoardMembers={availableBoardMembers}
                          cardMembers={cardMembers}
                          changeTaskMembers={onChangeTaskMembers}
                          onCloseModal={() =>
                            setAreMembersShown(!areMembersShown)
                          }
                        />
                      )}
                    </div>
                  );
                }
                case "status": {
                  return (
                    <div key={cardOrder} className='card-status card-cell'>
                      <LabelMenu
                        isScroll={isScroll}
                        isLast={isLast}
                        onDeleteLabel={onDeleteLabel}
                        onAddLabel={onAddCardLabel}
                        enableAdding={true}
                        onSaveLabel={onChangeCardLabels}
                        labelType='status'
                        labelGroup='statuses'
                        labels={group.statuses}
                        currLabel={card.status}
                      />
                    </div>
                  );
                }
                case "date": {
                  return (
                    <ClickAwayListener
                      key={cardOrder}
                      onClickAway={(ev) => {
                        // if (ev.target.className === 'dateRange-container card-cell') return
                        closeDatePicker();
                      }}
                    >
                      <div
                        className='dateRange-container card-cell'
                        onClick={() => setIsDateShown(true)}
                      >
                        <ProgressBar
                          onClick={() =>
                            setIsDateShown((isDateShown) => !isDateShown)
                          }
                          startDate={card.dueDate.startDate}
                          endDate={card.dueDate.endDate}
                          status={card.status}
                          createdAt={card.createdAt}
                          groupColor={group.style.color}
                        />
                        {isDateShown && (
                          <DatePicker
                            changeDates={onChangeCardDates}
                            closeDatePicker={closeDatePicker}
                            cardId={card.id}
                          />
                        )}
                      </div>
                    </ClickAwayListener>
                  );
                }
                case "workingDays": {
                  return (
                    <div key={cardOrder} className='card-workingDays card-cell'>
                      {workingDays}
                    </div>
                  );
                }
                case "priority": {
                  return (
                    <div key={cardOrder} className='card-priority card-cell'>
                      <LabelMenu
                        isScroll={isScroll}
                        isLast={isLast}
                        onDeleteLabel={onDeleteLabel}
                        onAddLabel={onAddCardLabel}
                        onSaveLabel={onChangeCardLabels}
                        enableAdding={false}
                        labelType='priority'
                        labelGroup='priorities'
                        labels={group.priorities}
                        currLabel={card.priority}
                      />
                    </div>
                  );
                }
              }
            })}

            <div className='card-closer card-cell-small'></div>
          </div>
        )}
      </Draggable>

      {isInDeleteMode && (
        <ConfirmModal
          id={card.id}
          arg={group}
          onApprove={onDeleteCard}
          close={() => setIsInDeleteMode(false)}
          isInDeleteMode={isInDeleteMode}
          title={card.title}
          type={"Card"}
        />
      )}
    </>
  );
};
