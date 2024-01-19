const initialState = {
  boards: [],
  board: null,
  onDrag: false,
  boardMembers: [],
  isLoading: true,
  isScroll: false,
};
export function boardReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_BOARDS":
      return { ...state, boards: action.boards, isLoading: false };
    case "SET_BOARD_MEMBERS":
      return { ...state, boardMembers: action.members };
    case "SET_CURR_BOARD":
      return { ...state, board: action.board };
    case "UPDATE_BOARDS":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board._id === action.board._id ? action.board : board
        ),
        board: action.board,
      };
    case "UPDATE_BOARDS_GENERALLY":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board._id === action.board._id ? action.board : board
        ),
      };
    case "UPDATE_BOARD_MEMBERS":
      return {
        ...state,
        boardMembers: state.boardMembers.map((member) =>
          member._id === action.updatedUser._id ? action.updatedUser : member
        ),
      };
    case "ADD_BOARD":
      return { ...state, boards: [...state.boards, action.board] };
    case "REMOVE_BOARD":
      return {
        ...state,
        boards: state.boards.filter((board) => board._id !== action.boardId),
      };
    case "ON_DRAG":
      return { ...state, onDrag: true };
    case "ON_DRAG_END":
      return { ...state, onDrag: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "GROUP_SCROLL":
      return { ...state, isScroll: action.isScroll };
    default:
      return state;
  }
}
