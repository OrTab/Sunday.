const initialState = {
    boards: [],
    board: null,
    onDrag: false
}
export function boardReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_BOARDS':
            return { ...state, boards: action.boards }
        case 'SET_CURR_BOARD':
            return { ...state, board: action.board }
        case 'UPDATE_BOARDS':
            return {
                ...state, boards: state.boards.map(board => {
                    return board._id === action.board._id ? action.board : board
                })
            }
        case 'ADD_BOARD':
            return { ...state, boards: [...state.boards, action.board] }
        case 'REMOVE_BOARD':
            return { ...state, boards: state.boards.filter(board => board._id !== action.boardId) }
        case 'ON_DRAG':
            return { ...state, onDrag: true }
        case 'ON_DRAG_END':
            return { ...state, onDrag: false }
        default:
            return state
    }
}