import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllServers } from "../../../store/servers";
import { addServerUser } from "../../../store/serverUser";

import "./ServerList.css";

function UsersList() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const loggedInUserId = sessionUser.id;

  const allServers = useSelector((state) => state.servers);

  let allServersArray;
  if (allServers.allServers) allServersArray = Object.values(allServers.notIn);
  let publicServers;

  if (allServersArray) {
    publicServers = allServersArray.filter((server) => !server.private);
  }

  useEffect(() => {
    dispatch(getAllServers(loggedInUserId));
  }, [dispatch]);

  if (publicServers) {
    return (
      <div className="servers-div">
        <h1 className="pub-server-title">Servers you may like</h1>
        <h3 className="server-text">
          Click "join now" to become a member of any of these servers.
          <br /> Meet a new community.
        </h3>
        <ul className="server-ul">
          {publicServers.map((server) => (
            <li classname="server-li">
              {server.name}
              <button
                className="joinBtn1"
                onClick={async (e) => {
                  e.preventDefault();
                  await dispatch(addServerUser(loggedInUserId, server.id));
                  await dispatch(getAllServers(loggedInUserId));
                }}
              >
                Join Now
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return <p className="loading">Loading...</p>;
}

export default UsersList;
