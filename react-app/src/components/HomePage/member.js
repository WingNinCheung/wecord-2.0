import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./message.css";
import "./member.css";
import User from "../User";

export default function Member({ serverId }) {
  const serverUsers = useSelector((state) => state.serverUsers);

  if (!serverId) return <p></p>;

  const handleClick = () => {
    return <User />;
  };
  return (
    <ul className="memberUl">
      {serverUsers &&
        Object.values(serverUsers).map((ele) => (
          <li key={ele.user.id} className="memberli">
            <NavLink to={`/users/${ele.user.id}`} className="memberli1">
              {ele.user.username}
            </NavLink>
          </li>
        ))}
    </ul>
  );
}
