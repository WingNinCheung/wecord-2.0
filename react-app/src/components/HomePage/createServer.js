import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createServer } from "../../store/servers";
import { useHistory } from "react-router-dom";
import "./createServer.css";

export default function CreateForm() {
  const [name, setName] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const sessionUser = useSelector((state) => state.session.user.id);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name,
      private: false,
      picture: null,
      master_admin: sessionUser,
    };

    const newServer = await dispatch(createServer(data));

    if (newServer) {
      history.push("/home");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.push("/home");
  };

  useEffect(() => {
    const errors = [];

    if (!name.trim().length) {
      errors.push("Server name cannot be empty!");
    }

    if (name.length > 22) {
      errors.push("The name cannot be longer than 22 characters");
    }

    setValidationErrors(errors);
  }, [name]);

  return (
    <div className="createServerPage">
      <div className="create-serverform">
        <h3 className="Title">Create a server</h3>
        <form onSubmit={handleSubmit} className="create-form">
          <ul className="Err">
            {validationErrors.map((error) => (
              <li key={error} className="error">
                {error}
              </li>
            ))}
          </ul>
          <input
            placeholder="Server Name"
            onChange={(e) => setName(e.target.value)}
            className="inputarea"
          ></input>
          <button className="createButton" disabled={validationErrors.length}>
            Create
          </button>
          <button className="createButton" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
