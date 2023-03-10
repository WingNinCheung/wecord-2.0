import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./message.css";
import "./member.css";

export default function Member({ serverId }) {
  const serverUsers = useSelector((state) => state.serverUsers);

  if (!serverId) return <p></p>;

  return (
    <ul className="memberUl">
      {serverUsers &&
        Object.values(serverUsers).map((ele) => (
          <div key={ele.user.id} className="memberli">
            {ele.user.username}
          </div>
        ))}
    </ul>
  );
}
