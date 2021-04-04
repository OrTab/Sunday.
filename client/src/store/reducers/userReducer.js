import { userService } from "../../services/userService";
const initialState = {
    users: [],
    loggedInUser: userService.getLoggedinUser(),
    msg: '',
}
export function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_LOGGED_IN_USER':
            return { ...state, loggedInUser: action.user }
        case 'LOG_OUT':
            return { ...state, loggedInUser: null }
        case 'SET_MSG':
            return { ...state, msg: action.msg }
        case 'CLEAR_MSG':
            return { ...state, msg: null }
        default:
            return state
    }
}