import { getServerChannelsThunk } from "../../../store/channel";
// import { getChannelMessagesThunk } from "../../store/messages";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Channels({ serverId }) {
  const [selectedChannelId, setSelectedChannelId] = useState(1);
  const [showChannelMessages, setShowChannelMessages] = useState(false);
  const [goToChannelMessages, setGoToChannelsMessages] = useState(false);
  const [goToChannel, setGoToChannels] = useState(false);
  const [openChannels, setOpenChannels] = useState(false);

  const dispatch = useDispatch();

  //   console.log("Here", serverId);

  const loadChannel = async () => {
    // if (goToChannel) {
    const result = await dispatch(getServerChannelsThunk(serverId));
    console.log("result:", result);
    // setGoToChannels(false);
    // }
  };

  useEffect(() => {
    loadChannel();
  }, [dispatch, goToChannel]);

  const allChannels = useSelector((state) => state.channel);
  const serverChannels = Object.values(allChannels);

  const channelSetter = (e) => {
    const channelId = e.target.value;
    setSelectedChannelId(channelId);
    setShowChannelMessages(true);
    setGoToChannelsMessages(true);
  };
  return (
    <div className="serverChannels">
      <h3>Channels</h3>
      {openChannels ? (
        <div>
          <ul className="channelsDisplay">
            {serverChannels &&
              serverChannels.map((channel) => (
                <li key={channel.id}>
                  <div>
                    <i class="fa-solid fa-hashtag"></i>
                  </div>
                  <button
                    className="singleChannelDisplay"
                    value={channel.id}
                    onClick={(e) =>
                      // setSelectedChannelId(channel.id);
                      // setShowChannelMessages(true);
                      // setGoToChannelsMessages(true);
                      channelSetter(e)
                    }
                  >
                    {channel.title}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div> </div>
      )}
    </div>
  );
}
