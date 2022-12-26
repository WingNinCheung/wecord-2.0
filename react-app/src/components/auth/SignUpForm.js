import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { signUp } from "../../store/session";

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const onSignUp = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (validator()) {
      setErrors([]);
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data);
      } else {
        history.push("/home");
      }
    }
  };

  const validator = () => {
    let errors = [];

    if (username.trim() === "") {
      errors.push("User name cannot be empty");
    }
    if (email.trim() === "") {
      errors.push("Email cannot be empty");
    }

    if (!/[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,3}/.test(email)) {
      errors.push("Invalid email address (e.g abc@gmail.com)");
    }

    if (password !== repeatPassword) {
      errors.push("Password and repeat password do not match");
    }
    if (errors.length) {
      setErrors(errors);
      return false;
    } else {
      return true;
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/home" />;
  }

  return (
    <form className="login-container" onSubmit={onSignUp}>
      <div>
        {/* {hasSubmitted && */}
        {errors.map((error, ind) => (
          <div key={ind} className="error">
            {error}
          </div>
        ))}
      </div>
      <h2 className="login-title">Create an Account</h2>
      <div className="field">
        <div>
          <div>
            <label className="label">User Name</label>
          </div>
        </div>
        <div>
          <input
            className="field-input"
            type="text"
            name="username"
            onChange={updateUsername}
            value={username}
          ></input>
        </div>
        <div>
          <div>
            <label className="label">Email</label>
          </div>
          <div>
            <input
              className="field-input"
              type="text"
              name="email"
              onChange={updateEmail}
              value={email}
            ></input>
          </div>
        </div>
        <div>
          <div>
            <label className="label">Password</label>
          </div>
          <input
            className="field-input"
            type="password"
            name="password"
            onChange={updatePassword}
            value={password}
          ></input>
        </div>
        <div>
          <div>
            <label className="label">Confirm Password</label>
          </div>
          <input
            className="field-input"
            type="password"
            name="repeat_password"
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}
          ></input>
        </div>
        <div className="login-but-grp">
          <button className="submit-btn " type="submit">
            Sign Up
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
