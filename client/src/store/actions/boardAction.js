import { boardService } from "../../services/boardService";
import { socketService } from "../../services/socketService";
import { userService } from "../../services/userService";

const setBoard = (dispatch, board) =>
  dispatch({ type: "SET_CURR_BOARD", board });

export function loadBoards(userId) {
  return async (dispatch) => {
    try {
      const boards = await boardService.query(userId);
      const action = {
        type: "SET_BOARDS",
        boards,
      };
      dispatch(action);
      return boards;
    } catch (err) {
      throw err;
    }
  };
}

export function changeBoardTitle(newTitle, board, user) {
  return async (dispatch) => {
    try {
      const boardToUpdate = await boardService.changeBoardTitle(
        newTitle,
        board,
        user
      );
      const action = {
        type: "UPDATE_BOARDS",
        board: boardToUpdate,
      };
      dispatch(action);
    } catch (err) {
      const action = {
        type: "UPDATE_BOARDS",
        board,
      };
      dispatch(action);
      throw err;
    }
  };
}
export function removeBoard(boardId) {
  return async (dispatch) => {
    try {
      await boardService.removeBoard(boardId);
      const action = {
        type: "REMOVE_BOARD",
        boardId,
      };
      dispatch(action);
    } catch (err) {
      throw err;
    }
  };
}
export function updateBoards(board) {
  return (dispatch) => {
    const action = {
      type: "UPDATE_BOARDS",
      board,
    };
    dispatch(action);
  };
}

export function getBoardById(boardId) {
  return async (dispatch) => {
    try {
      const board = await boardService.getBoardById(boardId);
      const action = {
        type: "SET_CURR_BOARD",
        board,
      };
      dispatch(action);
      return board;
    } catch (err) {
      throw err;
    }
  };
}
export function addCard(cardToAdd) {
  return async (dispatch) => {
    try {
      const board = await boardService.addCard(cardToAdd);
      const action = {
        type: "UPDATE_BOARDS",
        board,
      };
      dispatch(action);
    } catch (err) {
      const action = {
        type: "UPDATE_BOARDS",
        board: cardToAdd.board,
      };
      dispatch(action);
      throw err;
    }
  };
}
export function addGroup(board, user) {
  return async (dispatch) => {
    try {
      const boardToUpdate = await boardService.addGroup(board, user);
      const action = {
        type: "UPDATE_BOARDS",
        board: boardToUpdate,
      };
      dispatch(action);
    } catch (err) {
      const action = {
        type: "UPDATE_BOARDS",
        board,
      };
      dispatch(action);
      throw err;
    }
  };
}
export function addBoard(boardTitle, userId) {
  return async (dispatch) => {
    try {
      const board = await boardService.addBoard(boardTitle, userId);
      const action = {
        type: "ADD_BOARD",
        board,
      };
      dispatch(action);
    } catch (err) {
      console.log(err);
    }
  };
}

export function setBoardMembers(members) {
  return (dispatch) => {
    try {
      dispatch({ type: "SET_BOARD_MEMBERS", members });
    } catch (err) {}
  };
}

//TODO: FIX
export function changeGroupIdx(board, result) {
  return async (dispatch) => {
    try {
      const action = {
        type: "SET_CURR_BOARD",
        board,
      };
      dispatch(action);
      await boardService.changeGroupIdx(board, result);
    } catch (err) {
      console.log(err);
    }
  };
}
export function changeCardIdx(board, result) {
  return async (dispatch) => {
    try {
      const action = {
        type: "SET_CURR_BOARD",
        board,
      };
      dispatch(action);
      await boardService.changeCardIdx(board);
    } catch (err) {
      console.log(err);
    }
  };
}
export function deleteCard(cardToDelete) {
  return async (dispatch) => {
    try {
      const boardToUpdate = await boardService.deleteCard(cardToDelete);
      const action = {
        type: "SET_CURR_BOARD",
        board: boardToUpdate,
      };
      dispatch(action);
    } catch (err) {
      const action = {
        type: "SET_CURR_BOARD",
        board: cardToDelete.board,
      };
      dispatch(action);
      throw err;
    }
  };
}
export function changeBoardMemebrs(memberData, board, type, user) {
  return async (dispatch) => {
    try {
      const notification = await boardService.changeBoardMemebrs(
        memberData,
        board,
        type,
        user
      );
      const { boardToUpdate } = notification;
      setBoard(dispatch, boardToUpdate);
      const userToUpdate = await userService.updateNotifications(notification);
      socketService.emit("onUpdateUser", {
        user: userToUpdate,
        board: boardToUpdate,
        type,
      });
    } catch (err) {
      console.log(err);
    }
  };
}
export function removeGroup(board, group, user) {
  return async (dispatch) => {
    try {
      const boardToUpdate = await boardService.removeGroup(board, group, user);
      const action = {
        type: "SET_CURR_BOARD",
        board: boardToUpdate,
      };
      dispatch(action);
    } catch (err) {
      const action = {
        type: "SET_CURR_BOARD",
        board,
      };
      dispatch(action);
      throw err;
    }
  };
}
export function changeCardLabels(detailsForUpdateCardLabel) {
  return async (dispatch) => {
    try {
      const boardToUpdate = await boardService.changeCardLabels(
        detailsForUpdateCardLabel
      );
      setBoard(dispatch, boardToUpdate);
    } catch (err) {
      setBoard(dispatch, detailsForUpdateCardLabel.board);
      throw err;
    }
  };
}
export function addCardLabel(board, groupId, label, labelGroup) {
  return async (dispatch) => {
    try {
      const boardToUpdate = await boardService.addCardLabel(
        board,
        groupId,
        label,
        labelGroup
      );
      const action = {
        type: "SET_CURR_BOARD",
        board: boardToUpdate,
      };
      dispatch(action);
    } catch (err) {
      const action = {
        type: "SET_CURR_BOARD",
        board,
      };
      dispatch(action);
      throw err;
    }
  };
}
export function changeCardTitle(detailsForUpdateCard) {
  return async (dispatch) => {
    try {
      const boardToUpdate = await boardService.changeCardTitle(
        detailsForUpdateCard
      );
      setBoard(dispatch, boardToUpdate);
    } catch (err) {
      setBoard(dispatch, detailsForUpdateCard.board);
    }
  };
}

export function deleteLabel(detailsForDeleteLabel) {
  return async (dispatch) => {
    try {
      const boardToUpdate = await boardService.deleteLabel(
        detailsForDeleteLabel
      );
      setBoard(dispatch, boardToUpdate);
    } catch (err) {
      setBoard(dispatch, detailsForDeleteLabel.board);
      throw err;
    }
  };
}
export function changeGroupColor(color, board, groupId) {
  return async (dispatch) => {
    try {
      const boardToUpdate = await boardService.changeGroupColor(
        color,
        board,
        groupId
      );
      const action = {
        type: "SET_CURR_BOARD",
        board: boardToUpdate,
      };
      dispatch(action);
    } catch (err) {
      const action = {
        type: "SET_CURR_BOARD",
        board,
      };
      dispatch(action);
      throw err;
    }
  };
}
export function changeGroupTitle(groupToUpdate) {
  return async (dispatch) => {
    try {
      const board = await boardService.changeGroupTitle(groupToUpdate);
      const action = {
        type: "SET_CURR_BOARD",
        board,
      };
      dispatch(action);
    } catch (err) {
      const action = {
        type: "SET_CURR_BOARD",
        board: groupToUpdate.board,
      };
      dispatch(action);
      throw err;
    }
  };
}
export function changeTaskMembers(member, sign, board, card, groupId, user) {
  return async (dispatch) => {
    try {
      const notification = await boardService.updateTaskMembers(
        member,
        sign,
        board,
        card,
        groupId,
        user
      );
      const { boardToUpdate, notificationTxt } = notification;
      setBoard(dispatch, boardToUpdate);
      if (notificationTxt) {
        const userToUpdate = await userService.updateNotifications(
          notification
        );
        socketService.emit("onUpdateUser", { user: userToUpdate });
      }
    } catch (err) {}
  };
}
export function changeCardDates(dates, board, groupId, card, user) {
  return async (dispatch) => {
    try {
      const boardToUpdate = await boardService.changeCardDates(
        dates,
        board,
        groupId,
        card,
        user
      );
      const action = {
        type: "SET_CURR_BOARD",
        board: boardToUpdate,
      };
      dispatch(action);
    } catch (err) {
      const action = {
        type: "SET_CURR_BOARD",
        board,
      };
      dispatch(action);
      throw err;
    }
  };
}
export function getKeyById(object, targetValue) {
  return async () => {
    try {
      return boardService.getKeyById(object, targetValue);
    } catch (err) {
      console.log(err);
    }
  };
}
export function addCardUpdate(cardUpdate, board, card) {
  return async () => {
    try {
      return await boardService.addCardUpdate(cardUpdate, board, card);
    } catch (err) {
      console.log(err);
    }
  };
}
export function dragStart() {
  return (dispatch) => {
    const action = {
      type: "ON_DRAG",
    };
    dispatch(action);
  };
}
export function dragEnd() {
  return (dispatch) => {
    const action = {
      type: "ON_DRAG_END",
    };
    dispatch(action);
  };
}
