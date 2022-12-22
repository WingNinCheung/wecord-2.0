import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  getChannelMessagesThunk,
  createMessage,
  editMessageThunk,
  deleteMessageThunk,
} from "../../../store/messages";
import EditMessageForm from "./editMessageForm";
import EditFormModal from "../../auth/EditMessageModal";

// initialize socket variable
let socket;

export default function Chat({
  channelId,
  LoadChannelMessages,
  goToChannelMessages,
}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  let oldMessages = useSelector((state) => state.messages);
  let errors = [];
  console.log("1", oldMessages);

  // user messages
  const [messages, setMessages] = useState([]);
  // controlled form input
  const [chatInput, setChatInput] = useState("");

  const [validationErrors, setValidationErrors] = useState([]);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [messageUserId, setMessageUserId] = useState("");
  const [deleteStatus, setDeleteStatus] = useState(false);
  console.log("channel id:", channelId, messages);
  // console.log("message id is ", messageId);

  useEffect(() => {
    LoadChannelMessages();
  }, [dispatch, channelId, goToChannelMessages]);

  // For deleting messages
  useEffect(async () => {
    if (deleteStatus) {
      await dispatch(deleteMessageThunk(user.id, messageId));
      await dispatch(getChannelMessagesThunk(channelId));
    }
    LoadChannelMessages();
    setMessages(Object.values(oldMessages));
    setDeleteStatus(false);
  }, [dispatch, deleteStatus, goToChannelMessages]);

  useEffect(async () => {
    console.log("old is ", oldMessages, channelId);
    // LoadChannelMessages();
    await dispatch(getChannelMessagesThunk(channelId));
    // setMessages(Object.values(oldMessages));
  }, [socket, channelId, goToChannelMessages]);

  // Run socket stuff (so connect/disconnect ) whenever channelId changes
  useEffect(() => {
    // create websocket/connect
    socket = io();

    socket.on("connect", () => {
      socket.emit("join", { username: user.username, channelId: channelId });
    });

    // listen for chat events
    socket.on("chat", async (chat) => {
      // when we receive a chat, add to our messages array in state
      console.log("fuck", chat);
      setMessages((messages) => [...messages, chat]);
      await dispatch(getChannelMessagesThunk(channelId));
      // setMessages(Object.values(oldMessages));
    });

    // listen for edited messages
    socket.on("edit", async (updatedMessages) => {
      setOpenEditForm(false);
      console.log("the origin msg", messages);
      console.log("what I have", updatedMessages);
      const updatedID = updatedMessages.messageId;
      setMessages((messages) => [
        ...messages,
        (messages.find((msg) => msg.id == updatedID).message =
          updatedMessages.message),
      ]);
      // await dispatch(getChannelMessagesThunk(channelId));
    });

    // disconnect upon component unmount
    return () => {
      socket.emit("leave", { username: user.username, channelId: channelId });
      socket.disconnect();
    };
  }, [channelId]);

  const updateChatInput = (e) => {
    setChatInput(e.target.value);
  };

  const sendChat = async (e) => {
    e.preventDefault();

    // last object value tells database to edit message or not
    if (chatInput.trim() !== "") {
      if (openEditForm) {
        if (messageId) {
          //need messageId or edit gets messed up
          socket.emit("edit", {
            user: user.username,
            message: chatInput,
            userId: user.id,
            channelId: channelId,
            messageId: messageId,
            messageUserId: messageUserId,
          });
        }
      } else {
        socket.emit("chat", {
          user: user.username,
          message: chatInput,
          userId: user.id,
          channelId: channelId,
        });
      }
    }
    setOpenEditForm(false);
    setChatInput("");
  };

  return (
    <div className="container-message">
      <div className="messagesDisplay">
        {messages.length !== 0 ? (
          messages.map((message, i) =>
            message.message ? (
              <div key={i} className="singleMessageDisplay">
                <div className="username">
                  <i className="fa-solid fa-user"></i>
                  {message.user}
                </div>

                <div className="msg-body">
                  <span className="message">{message.message}</span>
                </div>
                <div className="edit-del">
                  <span
                    onClick={() => {
                      setMessageId(message.id);
                      setOpenEditForm(true);
                      setMessageUserId(message.userId);
                      setChatInput(message.message);
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </span>
                  <span>
                    <span
                      onClick={() => {
                        setMessageId(message.id);
                        setDeleteStatus(true);
                        setMessageUserId(message.userId);
                      }}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </span>
                  </span>
                </div>
              </div>
            ) : (
              <div></div>
            )
          )
        ) : (
          <div>No Messages Yet</div>
        )}

        {/* <div className="message-form form">
          <div className="createMessageForm">
            {openEditForm ? (
              <EditFormModal
                messageId={messageId}
                userId={user.id}
                setShow={setOpenEditForm}
                msgUserId={messageUserId}
                chatInput={chatInput}
                updateChatInput={updateChatInput}
                sendChat={sendChat}
              />
            ) : (
              <form onSubmit={sendChat}>
                <ul>
                  {validationErrors.map((error) => (
                    <li key={error} className="error">
                      {error}
                    </li>
                  ))}
                </ul>
                <textarea
                  className="create-message"
                  placeholder="Write messages here"
                  value={chatInput}
                  onChange={updateChatInput}
                />
                <button
                  type="Submit"
                  disabled={chatInput.trim().length === 0}
                  className="send-button"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div> */}
      </div>
      <div className="message-form form">
        <div className="createMessageForm">
          {openEditForm ? (
            <EditFormModal
              messageId={messageId}
              userId={user.id}
              setShow={setOpenEditForm}
              msgUserId={messageUserId}
              chatInput={chatInput}
              updateChatInput={updateChatInput}
              sendChat={sendChat}
            />
          ) : (
            <form onSubmit={sendChat}>
              <ul>
                {validationErrors.map((error) => (
                  <li key={error} className="error">
                    {error}
                  </li>
                ))}
              </ul>
              <textarea
                className="create-message"
                placeholder="Write messages here"
                value={chatInput}
                onChange={updateChatInput}
              />
              <button
                type="Submit"
                disabled={chatInput.trim().length === 0}
                className="send-button"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
