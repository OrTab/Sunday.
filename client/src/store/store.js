import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'

import {userReducer} from './reducers/userReducer.js'
import {boardReducer} from './reducers/boardReducer.js'
const rootReducer = combineReducers({
  boardReducer,
  userReducer
})


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

// window.theStore = store;
// store.subscribe(() => {
//     console.log('State is:',store.getState())
// })