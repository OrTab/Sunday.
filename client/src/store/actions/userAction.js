import { userService } from "../../services/userService";

export function query(txt) {
  return async () => {
    try {
      return await userService.getUsers(txt);
    } catch (err) {}
  };
}

export function setMsg(msg) {
  return (dispatch) => {
    let action = {
      type: "SET_MSG",
      msg,
    };
    dispatch(action);
    setTimeout(() => {
      action = {
        type: "CLEAR_MSG",
      };
      dispatch(action);
    }, 2000);
  };
}
export function clearMsg() {
  return (dispatch) => {
    const action = {
      type: "CLEAR_MSG",
    };
    dispatch(action);
  };
}
export function checkLogin(credentials) {
  return async (dispatch) => {
    try {
      const user = await userService.login(credentials);
      const action = {
        type: "SET_LOGGED_IN_USER",
        user,
      };
      dispatch(action);
      return user;
    } catch (err) {
      throw err;
    }
  };
}
export function signup(credentials) {
  return async (dispatch) => {
    try {
      const user = await userService.signup(credentials);
      const action = {
        type: "SET_LOGGED_IN_USER",
        user,
      };
      dispatch(action);
      return user;
    } catch (err) {
      throw err;
    }
  };
}
export function logOut() {
  return async (dispatch) => {
    try {
      await userService.logout();
      dispatch({ type: "LOG_OUT" });
      dispatch({ type: "SET_BOARDS", boards: [] });
      dispatch({ type: "SET_CURR_BOARD", board: null });
    } catch (err) {}
  };
}
export function updateUser(newUserInfo, type) {
  return async (dispatch) => {
    try {
      const user = await userService.update(newUserInfo, type);
      const action = {
        type: "SET_LOGGED_IN_USER",
        user,
      };
      dispatch(action);
      return user;
    } catch (err) {
      throw err;
    }
  };
}
export function updateUserNotifications(user) {
  return (dispatch) => {
    const action = {
      type: "SET_LOGGED_IN_USER",
      user,
    };
    dispatch(action);
  };
}

export function cleanNotifications(user) {
  return async (dispatch) => {
    try {
      const userToUpdate = await userService.cleanNotifications(user);
      const action = {
        type: "SET_LOGGED_IN_USER",
        user: userToUpdate,
      };
      dispatch(action);
    } catch (err) {
      console.log(err);
    }
  };
}
export function updateReadNotifications(user) {
  return async () => {
    try {
      const userToUpdate = await userService.updateReadNotifications(user);
      return (dispatch) => {
        const action = {
          type: "SET_LOGGED_IN_USER",
          user: userToUpdate,
        };
        dispatch(action);
      };
    } catch (err) {
      console.log(err);
    }
  };
}
