// actions
const ADD_SERVERUSER = "serverusers/ADD_SERVERUSER";
const GET_ALL_SERVERUSERS = "serverusers/GET_ALL_SERVERUSERS";
const LEAVE_SERVER = "serverusers/LEAVE_SERVER";

const getServerUsers = (serverUsers) => {
  return {
    type: GET_ALL_SERVERUSERS,
    serverUsers,
  };
};

const addUserToServer = (serverUser) => {
  return {
    type: ADD_SERVERUSER,
    serverUser,
  };
};

const deleteUserInServer = (serverUser) => {
  return {
    type: LEAVE_SERVER,
    serverUser,
  };
};

export const getAllServerUsers = (serverId) => async (dispatch) => {
  const res = await fetch(`/api/server_users/${serverId}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(getServerUsers(data.serverUser));
    return data.serverUser;
  }
};
export const addServerUser = (userId, serverId) => async (dispatch) => {
  const res = await fetch("/api/server_users/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, serverId }),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(addUserToServer(data));
    return data;
  }
};
export const leaveServer = (userId, serverId) => async (dispatch) => {
  const res = await fetch(`api/server_users/${serverId}/${userId}`, {
    method: "DELETE",
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(deleteUserInServer(data));
    return data;
  }
};
const serverUsers = (state = {}, action) => {
  let newState = {};
  switch (action.type) {
    case GET_ALL_SERVERUSERS:
      action.serverUsers.forEach((serverUser) => {
        newState[serverUser.user.id] = serverUser;
      });
      //   newState = { ...action.serverUsers };
      return newState;
    case ADD_SERVERUSER:
      newState = {
        ...state,
        [action.serverUser.user.id]: action.serverUser,
      };
      return newState;
    case LEAVE_SERVER:
      newState = { ...state };
      delete newState[action.serverUser.user.id];
      return newState;
    default:
      return state;
  }
};
export default serverUsers;
