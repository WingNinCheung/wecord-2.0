import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editMessageThunk } from "../../../store/messages";
import { useHistory } from "react-router-dom";

export default function EditMessageForm({
  messageId,
  userId,
  setShow,
  msgUserId,
  chatInput,
  updateChatInput,
  sendChat,
  setShowModal,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [validationErrors, setValidationErrors] = useState([]);

  const allMessages = useSelector((state) => Object.values(state.messages));
  const messageBody = allMessages.find((msg) => msg.id == messageId);

  const handleCancel = (e) => {
    e.preventDefault();
    setShow(false);
    setShowModal(true);
    // history.push("/home");
  };

  useEffect(() => {
    const errors = [];

    if (msgUserId !== userId) {
      errors.push("only people who created it can delete message");
    }

    if (!chatInput.trim().length) {
      errors.push("Message cannot be empty!");
    }
    setValidationErrors(errors);
  }, [chatInput]);

  return (
    <div className="">
      <div className="create-serverform">
        <h3 className="Title">Edit your message</h3>
        <form className="form-body" onSubmit={sendChat}>
          <ul className="Err">
            {validationErrors.map((error) => (
              <li key={error} className="error">
                {error}
              </li>
            ))}
          </ul>
          <textarea
            className="inputarea"
            value={chatInput}
            onChange={updateChatInput}
          />
          <button
            className="createButton"
            disabled={validationErrors.length > 0}
          >
            Update
          </button>
          <button className="createButton" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
