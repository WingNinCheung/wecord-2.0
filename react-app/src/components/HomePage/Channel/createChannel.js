import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createChannel } from "../../../store/channel";
import { getServerChannelsThunk } from "../../../store/channel";
import { useLocation } from "react-router-dom";
import "./CreateChannel.css";

export default function CreateChannel({ props }) {
  const [title, setTitle] = useState("");
  const [hidden, setHidden] = useState(true);
  const [validationErrors, setValidationErrors] = useState([]);
  const sessionUser = useSelector((state) => state.session.user.id);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      serverId: props.serverId,
    };

    await dispatch(createChannel(data, props.serverId));
    await dispatch(getServerChannelsThunk(props.serverId));
    setTitle("");
    setHidden(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setHidden(true);
    history.push("/home");
  };
  useEffect(() => {
    const errors = [];

    if (title.length > 18) {
      errors.push("Your name is more than 18 characters long!");
    }
    setValidationErrors(errors);
  }, [title]);

  return (
    <>
      <button
        onClick={() => {
          setHidden(false);
        }}
        className="createChannelBtn"
      >
        Create a Channel
      </button>
      <form
        hidden={hidden}
        onSubmit={handleSubmit}
        className="createChanneForm"
      >
        <ul>
          {validationErrors.map((error) => (
            <li key={error} className="error">
              {error}
            </li>
          ))}
        </ul>
        <input
          placeholder="Create Channel Here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="inputChannel"
        ></input>
        <div>
          <button
            className="createChannelBtn"
            disabled={validationErrors.length > 0 || title.trim().length === 0}
          >
            Create
          </button>
          <button className="createChannelBtn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
