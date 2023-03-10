const GET_CHANNEL_MESSAGES = "messages/GET_CHANNEL_MESSAGES";
const MAKE_NEW_MESSAGE = "messages/MAKE_NEW_MESSAGE";
const EDIT_MESSAGE = "messages/EDIT_MESSAGE";
const DELETE_MESSAGE = "messages/DELETE_MESSAGE";

// get
const getChannelMessages = (messages) => {
  return {
    type: GET_CHANNEL_MESSAGES,
    messages,
  };
};

// create
const createChannelMessage = (message) => {
  return {
    type: MAKE_NEW_MESSAGE,
    message,
  };
};

// delete
const deleteChannelMessage = (message) => {
  return {
    type: DELETE_MESSAGE,
    message,
  };
};

//get
export const getChannelMessagesThunk = (channelId) => async (dispatch) => {
  const res = await fetch(`/api/servers/channels/${channelId}`);
  if (res.ok) {
    const channelMessages = await res.json();
    dispatch(getChannelMessages(channelMessages));
    return res;
  }
};

// Create
export const createMessage = (message) => async (dispatch) => {
  const res = await fetch("/api/messages/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (res.ok) {
    const data = await res.json;

    dispatch(createChannelMessage(data));
    return data;
  }
};

// ---------------------------------------------
const editChannelMessage = (message) => {
  return {
    type: EDIT_MESSAGE,
    message,
  };
};
// EDIT MESSGAE THUNK
export const editMessageThunk =
  (userId, messageId, message) => async (dispatch) => {
    const res = await fetch(`/api/messages/${userId}/${messageId}/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    const data = await res.json();
    dispatch(createChannelMessage(data));
  };

//DELETE THUNK
export const deleteMessageThunk = (userId, messageId) => async (dispatch) => {
  const res = await fetch(`/api/messages/${userId}/${messageId}/delete`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(deleteChannelMessage(Number(data)));
  }
};

// ------------------------- REDUCER -----------------------------
const messages = (state = {}, action) => {
  let messages = {};
  switch (action.type) {
    case GET_CHANNEL_MESSAGES:
      action.messages.messages.forEach((message) => {
        messages[message.id] = message;
      });
      return messages;
    case MAKE_NEW_MESSAGE:
      if (!state[action.message.id]) {
        messages = { ...state, [action.message.id]: action.message };
        return messages;
      }
      messages = {
        ...state,
        [action.message.id]: {
          ...state[action.message.id],
          ...action.message,
        },
      };
      return messages;
    case DELETE_MESSAGE:
      messages = { ...state };
      delete messages[action.message.id];
      return messages;

    default:
      return state;
  }
};

export default messages;
