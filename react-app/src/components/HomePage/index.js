import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../store/user";
import { getAllServers, updateServer, deleteServer } from "../../store/servers";
import {
  getServerChannelsThunk,
  deleteChannelThunk,
} from "../../store/channel";
import { getChannelMessagesThunk } from "../../store/messages";

import Channel from "./Channel/index";

import {
  getAllServerUsers,
  addServerUser,
  leaveServer,
} from "../../store/serverUser";
import Member from "../../components/HomePage/member";

import "./HomePage.css";
import "./message.css";
import Chat from "./Chat/Chat";

function HomePage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const loggedInUserId = sessionUser.id;

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllServers(loggedInUserId));
  }, [dispatch]);

  // READ ALL PUBLIC AND PRIVATE SERVERS --------
  const allServers = useSelector((state) => state.servers);

  let publicServers, privateServers, allServersArray, defaultSelectedServerId;

  if (allServers.allServers) {
    allServersArray = Object.values(allServers.allServers);
  }

  if (publicServers) {
    defaultSelectedServerId = publicServers[0];
    if (defaultSelectedServerId) {
      defaultSelectedServerId = defaultSelectedServerId.id;
    }
  }

  if (allServers.yourServers) {
    privateServers = allServers.yourServers.filter((server) => {
      if (server.private === true) return server;
    });
  }

  if (allServersArray) {
    publicServers = allServers.yourServers.filter(
      (server) => server.private === false
    );
  }

  // EDIT SERVER - may use modal to refactor it
  const [name, setName] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [mainServer, setMainServer] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState(
    defaultSelectedServerId
  );
  const [adminId, setAdminId] = useState();
  const [goToChannel, setGoToChannels] = useState(false);
  const [openChannels, setOpenChannels] = useState(true);
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [showChannelMessages, setShowChannelMessages] = useState(false);
  const [goToChannelMessages, setGoToChannelsMessages] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [userIsInServer, setUserIsInServer] = useState(false);

  // true if we are in public view. false if we are looking @ private servers
  const [isPublic, setIsPublic] = useState(true);
  const history = useHistory();

  // right-click menu section
  const [show, setShow] = useState(false);
  const [channelShow, setChannelShow] = useState(false);
  const [location, setLocation] = useState({ x: 0, y: 0 });

  // the server edit
  const [edit, setEdit] = useState(false);
  const [editChannel, setEditChannel] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteChannelThunk(selectedServerId, selectedChannelId));
    setShowChannelMessages(false);
  };

  const handleDeleteServer = async (e) => {
    e.preventDefault();
    await dispatch(deleteServer(selectedServerId, loggedInUserId));
    await dispatch(getAllServers(loggedInUserId));
    setGoToChannels(false);
    setGoToChannelsMessages(false);
    setShowChannelMessages(false);
    setUserIsInServer(false);
    setSelectedServerId("");
    setOpenChannels(false);
  };

  const checkUserinServer = async (serverId) => {
    let userInServer = false;
    const data = await dispatch(getAllServerUsers(serverId));
    await dispatch(getServerChannelsThunk(serverId));

    for (let i of data) {
      if (i.user.id == loggedInUserId) {
        userInServer = true;
      }
    }

    if (userInServer) {
      setOpenChannels(true);
      setGoToChannels(true);
      setGoToChannelsMessages(false);
      setShowChannelMessages(false);
      setUserIsInServer(true);
      return true;
    } else {
      setOpenChannels(false);
      setGoToChannels(false);
      setGoToChannelsMessages(false);
      setShowChannelMessages(false);
      setUserIsInServer(false);
      return false;
    }
  };

  // Right click server menu
  const Menu = ({ x, y }) => {
    return (
      <div
        className="right-menu"
        style={{
          position: "absolute",
          top: `${x}px`,
          left: `${y}px`,
        }}
      >
        <div>
          <button
            onClick={() => {
              setEdit(true);
              setEditChannel(false);
            }}
            disabled={loggedInUserId !== adminId}
            className="edit-channel "
          >
            Edit Server
          </button>
        </div>
        <div>
          <button
            onClick={handleDeleteServer}
            disabled={loggedInUserId !== adminId}
            className="edit-channel "
          >
            Delete
          </button>
        </div>
        <div>
          <button
            onClick={handleLeave}
            disabled={!userIsInServer || loggedInUserId == adminId}
            className="edit-channel "
          >
            Leave Server
          </button>
        </div>
      </div>
    );
  };

  const ChannelMenu = ({ x, y }) => {
    return (
      <div
        className="right-menu"
        style={{
          position: "absolute",
          top: `${x}px`,
          left: `${y}px`,
        }}
      >
        <div>
          <button
            onClick={() => {
              setEditChannel(true);
              setEdit(false);
            }}
            disabled={loggedInUserId !== adminId}
            className="edit-channel "
          >
            Edit Channel
          </button>
        </div>
        <div>
          <button
            onClick={handleDelete}
            disabled={loggedInUserId !== adminId}
            className="edit-channel "
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
    };

    await dispatch(updateServer(payload, selectedServerId));
    setName("");
    setMainServer(false);
    setEdit(false);
    await dispatch(getAllServers(loggedInUserId));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEdit(false);
  };

  // Right-click menu for server
  const handleContextMenu = (e) => {
    e.preventDefault();
    setShow(true);
    setChannelShow(false);
  };
  // Right-click menu for channel
  const handleContextMenuChannel = (e) => {
    e.preventDefault();
    setChannelShow(true);
    setShow(false);
  };

  // left click anywhere will make the right-click menu disappear
  useEffect(() => {
    const handleClick = () => {
      setShow(false);
      setChannelShow(false);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  //----------------------------------------------------

  // READ ALL MESSAGES OF A SINGLE CHANNEL
  const channelMessages = useSelector((state) => state.messages);
  const channelMessagesArr = Object.values(channelMessages);

  const allUsers = useSelector((state) => state.users);
  const allUserArr = Object.values(allUsers);

  for (let i = 0; i < channelMessagesArr.length; i++) {
    for (let j = 0; j < allUserArr.length; j++) {
      if (channelMessagesArr[i].userId == allUserArr[j].id)
        channelMessagesArr[i]["username"] = allUserArr[j].username;
    }
  }

  if (privateServers) {
    for (let i = 0; i < privateServers.length; i++) {
      for (let j = 0; j < allUserArr.length; j++) {
        if (privateServers[i].name == allUserArr[j].id)
          privateServers[i]["username"] = allUserArr[j].username;
      }
    }
  }

  const LoadChannelMessages = async () => {
    if (goToChannelMessages) {
      if (typeof selectedChannelId !== "string") {
        await dispatch(getChannelMessagesThunk(selectedChannelId));
        setGoToChannelsMessages(false);
      }
    }
  };

  useEffect(() => {
    LoadChannelMessages();
  }, [dispatch, goToChannelMessages]);

  // ------------------------------------------------

  const handleJoin = async (e) => {
    e.preventDefault();
    await dispatch(addServerUser(loggedInUserId, selectedServerId));
    checkUserinServer(selectedServerId);
  };

  const handleLeave = async (e) => {
    e.preventDefault();
    setSelectedServerId("");
    await dispatch(leaveServer(loggedInUserId, selectedServerId));
    await checkUserinServer(selectedServerId);
    await dispatch(getAllServers(loggedInUserId));
  };

  // -----------------------------------------------

  // get server title for channel
  const getServerTitle = (chanlId) => {
    for (let server in allServers) {
      if (server.id === chanlId) {
        return server.name;
      }
    }
  };

  // create a channel

  return (
    <div>
      <div className="updateServerForm">
        {edit && (
          <div>
            <div className="updateTitle">
              <h3>Update Your Server Here!</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <ul>
                {validationErrors.map((error) => (
                  <li key={error} className="error">
                    {error}
                  </li>
                ))}
              </ul>
              <input
                placeholder={name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="inputUpdateServer"
              />
              <button
                disabled={validationErrors.length > 0}
                className="editBtn"
              >
                Edit
              </button>
              <button onClick={handleCancel} className="editBtn">
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="outContainer">
        {isPublic && (
          <div className="publicServers">
            <h3>Servers</h3>
            {isPublic && (
              <button
                className="switchbutton"
                onClick={() => setIsPublic(!isPublic)}
              >
                Friends
              </button>
            )}
            {!isPublic && (
              <button
                className="switchbutton"
                onClick={() => setIsPublic(!isPublic)}
              >
                Servers
              </button>
            )}
            <ul className="publicServersDisplay">
              <NavLink
                className="addaserverbutt"
                to="/create-server"
                alt="Create a Server"
              >
                +
              </NavLink>
              {publicServers &&
                publicServers.map((server) => (
                  <div
                    key={server.id}
                    onContextMenu={(e) => {
                      handleContextMenu(e);
                      setSelectedServerId(server.id);
                      setAdminId(server.master_admin);
                      setEdit(false);
                      setName(server.name);
                      setLocation({ x: e.pageX, y: e.pageY });
                    }}
                  >
                    <li>
                      <button
                        className="singleServerDisplay"
                        onClick={() => {
                          setMainServer(true);
                          setSelectedServerId(server.id);
                          setAdminId(server.master_admin);
                          checkUserinServer(server.id);
                        }}
                      >
                        {server.name}
                      </button>
                    </li>
                  </div>
                ))}
              {show && <Menu x={location.y} y={location.x} />}
            </ul>
          </div>
        )}
        {!isPublic && (
          <div className="privateServers">
            {isPublic && (
              <button
                className="switchbutton"
                onClick={() => setIsPublic(!isPublic)}
              >
                Friends
              </button>
            )}
            <h3>Direct Messages</h3>
            {!isPublic && (
              <button
                className="switchbutton"
                onClick={() => setIsPublic(!isPublic)}
              >
                Servers
              </button>
            )}
            <ul className="privateServersDisplay">
              {privateServers &&
                privateServers.map((server) => (
                  <li
                    key={server.id}
                    className="singleServerDisplay"
                    onClick={() => {
                      setMainServer(true);
                      setSelectedServerId(server.id);
                      setName(server.name);
                      checkUserinServer(server.id);
                    }}
                  >
                    {server.username}
                  </li>
                ))}
              {show && <Menu x={location.y} y={location.x} />}
            </ul>
          </div>
        )}

        {/* ----------Here is channel ----------*/}
        <Channel
          adminId={adminId}
          loggedInUserId={loggedInUserId}
          selectedServerId={selectedServerId}
          openChannels={openChannels}
          handleContextMenuChannel={handleContextMenuChannel}
          setLocation={setLocation}
          setSelectedChannelId={setSelectedChannelId}
          setChannelName={setChannelName}
          setShowChannelMessages={setShowChannelMessages}
          setGoToChannelsMessages={setGoToChannelsMessages}
          channelShow={channelShow}
          ChannelMenu={ChannelMenu}
          editChannel={editChannel}
          setEditChannel={setEditChannel}
          selectedChannelId={selectedChannelId}
          setEdit={setEdit}
          channelName={channelName}
          location={location}
          handleJoin={handleJoin}
          defaultSelectedServerId={defaultSelectedServerId}
          goToChannel={goToChannel}
        />
        {/* ----------channel done ----------*/}

        <div className="messagesContainer">
          {showChannelMessages && (
            <Chat
              channelId={selectedChannelId}
              LoadChannelMessages={LoadChannelMessages}
              goToChannelMessages={goToChannelMessages}
            />
          )}
        </div>
        <div className="userLists">
          <h3>Members</h3>
          <Member serverId={selectedServerId} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
