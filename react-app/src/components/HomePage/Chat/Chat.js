import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  getChannelMessagesThunk,
  deleteMessageThunk,
} from "../../../store/messages";
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

  const messageEl = useRef(null);

  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [messageUserId, setMessageUserId] = useState("");
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [chatRoom, setChatRoom] = useState("");

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
    await dispatch(getChannelMessagesThunk(channelId));
  }, [socket, channelId, goToChannelMessages]);

  // Auto scroll to bottom when new messages come in
  useEffect(() => {
    messageEl.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  // Allow users to press enter to send out messages
  useEffect(() => {
    const keyHandler = (event) => {
      if (event.key === "Enter") {
        sendChat(event);
      }
    };
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("keydown", keyHandler);
    };
  });

  // Live Chat
  useEffect(() => {
    // create websocket/connect
    socket = io();

    socket.on("connect", () => {
      socket.emit("join", { username: user.id, channelId: channelId });
    });

    socket.on("join", async (data) => {
      setChatRoom(data[user.id]);
    });
    // listen for chat events
    socket.on("chat", async (chat) => {
      setMessages((messages) => [...messages, chat]);
      await dispatch(getChannelMessagesThunk(channelId));
    });

    // listen for edited messages
    socket.on("edit", async (updatedMessages) => {
      setOpenEditForm(false);
      const updatedID = updatedMessages.messageId;
      setMessages((messages) => [
        ...messages,
        (messages.find((msg) => msg.id == updatedID).message =
          updatedMessages.message),
      ]);
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

    // Check if the input contains spaces or is empty
    if (chatInput.trim() !== "") {
      if (openEditForm) {
        if (messageId) {
          socket.emit("edit", {
            user: user.username,
            message: chatInput,
            userId: user.id,
            channelId: channelId,
            messageId: messageId,
            messageUserId: messageUserId,
            room: chatRoom,
          });
        }
      } else {
        socket.emit("chat", {
          user: user.username,
          message: chatInput,
          userId: user.id,
          channelId: channelId,
          room: chatRoom,
        });
      }
    }
    setOpenEditForm(false);
    setChatInput("");
  };

  return (
    <div className="innerMsg">
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
                {message.userId === user.id ? (
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
                ) : (
                  <div></div>
                )}
                <div key={i} ref={messageEl}></div>
              </div>
            ) : (
              <div></div>
            )
          )
        ) : (
          <div>No Messages Yet</div>
        )}
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
