import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GroupPreview } from "./group-preview-components/GroupPreview";
import { BoardHeader } from "./BoardHeader";
import {
  addCard,
  addGroup,
  changeBoardTitle,
  changeGroupTitle,
  changeBoardMemebrs,
  removeGroup,
  changeGroupIdx,
  changeCardIdx,
  dragStart,
} from "../store/actions/boardAction.js";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { DashBoard } from "./DashBoard";
import { boardService } from "../services/boardService";
import { setMsg } from "../store/actions/userAction.js";
import { NoResultsPlaceholder } from "./NoResultsPlaceholder";

export const BoardPreview = (props) => {
  const [filterBy, setFilterBy] = useState(null);
  const [isShowDashboard, setIsShowDashboard] = useState(false);

  const { board, onDrag, boardMembers } = useSelector(
    ({ boardReducer }) => boardReducer
  );
  const loggedInUser = useSelector(
    ({ userReducer }) => userReducer.loggedInUser
  );
  const dispatch = useDispatch();

  const onAddCard = (cardTitle, groupId) => {
    dispatch(addCard({ cardTitle, groupId, board, user: loggedInUser }));
    dispatch(setMsg("Card Successfully Added"));
  };
  const onAddGroup = () => {
    dispatch(addGroup(board, loggedInUser));
  };
  //Board Title
  const onChangeTitle = (boardTitle) => {
    dispatch(changeBoardTitle(boardTitle, board, loggedInUser));
  };
  //Group Title
  const onChangeGroupTitle = (groupTitle, groupId) => {
    dispatch(
      changeGroupTitle({ board, groupId, groupTitle, user: loggedInUser })
    );
  };
  const onChangeBoardMemebrs = (memberData, type) => {
    dispatch(changeBoardMemebrs(memberData, board, type, loggedInUser));
  };
  const onRemoveGroup = (group) => {
    dispatch(removeGroup(board, group, loggedInUser));
    dispatch(setMsg("Group Successfully Removed"));
  };
  // onChangeBoardMemebrs = async (memberData, type) => {
  //     console.log(memberData);
  //     const { changeBoardMemebrs, loggedInUser, board } = this.props;
  //     await changeBoardMemebrs(memberData, board, type, loggedInUser);
  // }

  // onRemoveGroup = async (group) => {
  //     const { removeGroup, board, loggedInUser } = this.props;
  //     await removeGroup(board, group, loggedInUser)
  //     this.props.setMsg('Group Successfully Removed')
  // }
  const onDragStart = () => {
    dispatch(dragStart());
  };
  // onDragEnd = (result) => {
  //     props.onDragEnd()
  //     const { destination, source, draggableId } = result
  //     if (!destination) return
  //     if (destination.droppableId === source.droppableId && destination.index === source.index || !destination.droppableId || !source.droppableId) return
  //     const { changeGroupIdx, changeCardIdx, board } = props
  //     const boardToUpdate = JSON.parse(JSON.stringify(board))
  //     if (result.type === 'group') {
  //         const newGroups = boardToUpdate.groups.map((group, idx, groups) => {
  //             if (idx === source.index) return groups[destination.index]
  //             if (idx === destination.index) return groups[source.index]
  //             else return group
  //         })
  //         boardToUpdate.groups = newGroups;
  //         changeGroupIdx(boardToUpdate, result)
  //     }
  //     else {
  //         const sourceGroup = boardService.getKeyById(boardToUpdate, source.droppableId)
  //         var cardToAdd = boardService.getKeyById(sourceGroup, draggableId)
  //         const groups = boardToUpdate.groups.map(group => {
  //             if (group.id === source.droppableId && group.id !== destination.droppableId) {
  //                 group.cards.splice(source.index, 1)
  //                 return group
  //             } else if (group.id !== source.droppableId && group.id === destination.droppableId) {
  //                 if (!cardToAdd) {
  //                     cardToAdd = boardService.getKeyById(group, draggableId)
  //                 }
  //                 group.cards.splice(destination.index, 0, cardToAdd)
  //                 return group
  //             } else if (group.id === source.droppableId && group.id === destination.droppableId) {
  //                 group.cards = group.cards.map((card, idx, cards) => {
  //                     if (idx === source.index) return cards[destination.index]
  //                     if (idx === destination.index) return cards[source.index]
  //                     else return card
  //                 })
  //                 return group
  //             } else return group
  //         })
  //         boardToUpdate.groups = groups
  //         changeCardIdx(boardToUpdate, result)
  //     }
  // }

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const boardToUpdate = { ...board };
    const newGroups = Array.from(boardToUpdate.groups);
    if (type === "group") {
      const draggedGroup = boardToUpdate.groups.find(
        (group) => group.id === draggableId
      );
      newGroups.splice(source.index, 1);
      newGroups.splice(destination.index, 0, draggedGroup);
      boardToUpdate.groups = newGroups;
      dispatch(changeGroupIdx(boardToUpdate));
    } else if (type === "card") {
      const sourceGroup = boardToUpdate.groups.find(
        (group) => group.id === source.droppableId
      );
      const destinationGroup = boardToUpdate.groups.find(
        (group) => group.id === destination.droppableId
      );
      if (sourceGroup.id === destinationGroup.id) {
        const newCards = Array.from(sourceGroup.cards);
        const newCard = sourceGroup.cards.find(
          (card) => card.id === draggableId
        );
        newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, newCard);
        const newGroup = {
          ...sourceGroup,
          cards: newCards,
        };
        const newIdx = boardToUpdate.groups.findIndex(
          (group) => group.id === newGroup.id
        );
        boardToUpdate.groups.splice(newIdx, 1, newGroup);
        dispatch(changeCardIdx(boardToUpdate));
      } else {
        const sourceGroupCards = Array.from(sourceGroup.cards);
        sourceGroupCards.splice(source.index, 1);
        const newSourceGroup = {
          ...sourceGroup,
          cards: sourceGroupCards,
        };
        const destinationGroupCards = Array.from(destinationGroup.cards);
        const newCardToPaste = sourceGroup.cards.find(
          (card) => card.id === draggableId
        );
        destinationGroupCards.splice(destination.index, 0, newCardToPaste);
        const newDestinationGroup = {
          ...destinationGroup,
          cards: destinationGroupCards,
        };
        const sourceIdx = boardToUpdate.groups.findIndex(
          (group) => group.id === newSourceGroup.id
        );
        const destinationIdx = boardToUpdate.groups.findIndex(
          (group) => group.id === newDestinationGroup.id
        );
        boardToUpdate.groups.splice(sourceIdx, 1, newSourceGroup);
        boardToUpdate.groups.splice(destinationIdx, 1, newDestinationGroup);
        dispatch(changeCardIdx(boardToUpdate));
      }
    } else {
      const groupId = source.droppableId.substring(
        source.droppableId.indexOf("-") + 1
      );
      const groupIdx = newGroups.findIndex((group) => group.id === groupId);
      const [sourceColumn] = newGroups[groupIdx].cardOrder.splice(
        source.index,
        1
      );
      newGroups[groupIdx].cardOrder.splice(destination.index, 0, sourceColumn);
      boardToUpdate.groups = newGroups;
      dispatch(changeCardIdx(boardToUpdate));
    }
  };

  const changeBoardView = ({ target }) => {
    const { value } = target;
    if (value === "dashboard") setIsShowDashboard(true);
    else setIsShowDashboard(false);
  };
  const onSetFilter = (filterBy) => {
    setFilterBy(filterBy);
  };

  const filteredBoard = useMemo(() => {
    const boardCopy = JSON.parse(JSON.stringify(board));
    if (filterBy) {
      if (filterBy.status.length) {
        boardCopy.groups = boardCopy.groups.filter((group) => {
          const filteredCards = group.cards.filter((card) => {
            const status = filterBy.status.find((label) => {
              return card.status.text === label;
            });
            if (!status) return false;
            return true;
          });
          if (filteredCards.length) {
            group.cards = filteredCards;
            return true;
          }
          return false;
        });
      }
      if (filterBy.priority.length) {
        boardCopy.groups = boardCopy.groups.filter((group) => {
          const filteredCards = group.cards.filter((card) => {
            const priority = filterBy.priority.find((label) => {
              return card.priority.text === label;
            });
            if (!priority) return false;
            return true;
          });
          if (filteredCards.length) {
            group.cards = filteredCards;
            return true;
          }
          return false;
        });
      }
      if (filterBy.membersId.length) {
        boardCopy.groups = boardCopy.groups.filter((group) => {
          const filteredCards = group.cards.filter((card) => {
            const member = card.members.find((memberId) => {
              return filterBy.membersId.includes(memberId);
            });
            if (!member) return false;
            return true;
          });
          if (filteredCards.length) {
            group.cards = filteredCards;
            return true;
          }
          return false;
        });
      }
      if (filterBy.sortBy && !onDrag) {
        if (filterBy.sortBy === "name")
          boardCopy.groups = boardService.sortByTitle(boardCopy.groups);
        else boardCopy.groups = boardService.sortByDate(boardCopy.groups);
      }
      const filterRegex = new RegExp(filterBy.txt, "i");
      boardCopy.groups = boardCopy.groups.filter((group) => {
        const filteredCards = group.cards.filter((card) =>
          filterRegex.test(card.title)
        );
        if (filteredCards.length) {
          group.cards = filteredCards;
          return true;
        } else return false || filterRegex.test(group.title);
      });
    }
    return boardCopy;
  }, [filterBy, board]);
  return (
    <div className='board-preview-container'>
      <BoardHeader
        loggedInUser={loggedInUser}
        board={board}
        boardMembers={boardMembers}
        onAddGroup={onAddGroup}
        changeBoardView={changeBoardView}
        onChangeTitle={onChangeTitle}
        onChangeBoardMemebrs={onChangeBoardMemebrs}
        onSetFilter={onSetFilter}
      />
      {/* {isShowDashboard && <DashBoard board={board} />} */}
      {!isShowDashboard && (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <div className='main-groups-container'>
            <Droppable droppableId={board._id} isCombineEnabled type='group'>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {!filteredBoard.groups.length ? (
                    <NoResultsPlaceholder msg='No results were found...' />
                  ) : (
                    filteredBoard.groups.map((group, idx) => (
                      <GroupPreview
                        key={group.id}
                        group={group}
                        onDrag={onDrag}
                        onAddCard={onAddCard}
                        board={board}
                        onRemoveGroup={onRemoveGroup}
                        onChangeGroupTitle={onChangeGroupTitle}
                        idx={idx}
                      />
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      )}
    </div>
  );
};
