import { useEffect, useState } from "react";

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
  const [validationErrors, setValidationErrors] = useState([]);

  const handleCancel = (e) => {
    e.preventDefault();
    setShow(false);
    setShowModal(true);
  };

  useEffect(() => {
    const errors = [];

    if (msgUserId !== userId) {
      errors.push("only people who created it can delete message");
    }

    if (!chatInput.trim().length) {
      errors.push("Message cannot be empty!");
    }
    if (chatInput.length >= 100) {
      errors.push("Message must be less than 100 characters");
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
