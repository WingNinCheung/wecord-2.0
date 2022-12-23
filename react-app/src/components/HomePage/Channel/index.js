import CreateChannel from "./createChannel";
import EditChannel from "./editChannel";
import { useDispatch, useSelector } from "react-redux";
import { getServerChannelsThunk } from "../../../store/channel";
import { useEffect, useState } from "react";

function Channel(props) {
  const dispatch = useDispatch();
  const loadChannel = async () => {
    await dispatch(getServerChannelsThunk(props.selectedServerId));
    props.setGoToChannels(false);
  };
  console.log("in channel", props.editChannel);

  useEffect(() => {
    if (props.defaultSelectedServerId) loadChannel();
  }, [dispatch, props.goToChannel]);

  const allChannels = useSelector((state) => state.channel);
  const serverChannels = Object.values(allChannels);

  return (
    <div className="serverChannels">
      <h3>Channels</h3>
      {props.adminId === props.loggedInUserId && props.selectedServerId && (
        <CreateChannel
          props={{
            serverId: props.selectedServerId,
          }}
        />
      )}
      {props.openChannels ? (
        <div>
          <ul className="channelsDisplay">
            {serverChannels &&
              serverChannels.map((channel) => (
                <div
                  key={channel.id}
                  onContextMenu={(e) => {
                    props.handleContextMenuChannel(e);
                    props.setLocation({ x: e.pageX, y: e.pageY });
                    props.setSelectedChannelId(channel.id);
                    props.setChannelName(channel.title);
                  }}
                >
                  <li key={channel.id} value={channel.serverId}>
                    <span>
                      <button
                        className="singleChannelDisplay highlight-dark"
                        onClick={() => {
                          props.setSelectedChannelId(channel.id);
                          props.setShowChannelMessages(true);
                          props.setGoToChannelsMessages(true);
                        }}
                      >
                        {`# ${channel.title}`}
                      </button>
                    </span>
                  </li>
                </div>
              ))}
            {props.channelShow && (
              <props.ChannelMenu x={props.location.y} y={props.location.x} />
            )}
          </ul>
        </div>
      ) : props.selectedServerId ? (
        <div>
          <button onClick={props.handleJoin} className="joinServerBtn">
            Join Server
          </button>
        </div>
      ) : (
        <div></div>
      )}

      {props.editChannel && (
        <EditChannel
          serverId={props.selectedServerId}
          channelId={props.selectedChannelId}
          setEdit={props.setEditChannel}
          channelTitle={props.channelName}
          loadChannel={props.loadChannel}
        />
      )}
    </div>
  );
}

export default Channel;
