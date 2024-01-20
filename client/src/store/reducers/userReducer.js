import { userService } from '../../services/userService';

export const userReducerInitialState = {
    users: [],
    loggedInUser: userService.getLoggedinUser(),
    msg: ''
};

export function userReducer(state = userReducerInitialState, action) {
    switch (action.type) {
        case 'SET_LOGGED_IN_USER':
            return { ...state, loggedInUser: action.user };
        case 'LOG_OUT':
            return { ...state, loggedInUser: null };
        case 'SET_MSG':
            return { ...state, msg: action.msg };
        case 'CLEAR_MSG':
            return { ...state, msg: null };
        default:
            return state;
    }
}
