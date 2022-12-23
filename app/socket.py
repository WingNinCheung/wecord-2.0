from flask_socketio import SocketIO, join_room, leave_room
from flask import request, jsonify
import os, json
from .models.db import db, Message, Channel
from .api.server_routes import get_channel_messages

# origins = [
#     "http://wecord.herokuapp.com/",
#     "https://wecord.herokuapp.com/"
# ]
# set CORS for security
# if os.environ.get("FLASK_ENV") != "production":
#     origins="*"

if os.environ.get("FLASK_ENV") == "production":
    origins = ["https://wecord-2.onrender.com", "http://wecord-2.onrender.com"]
else:
    origins = "*"


# create your SocketIO instance
socketio = SocketIO(cors_allowed_origins="*", logger=True, engineio_logger=True)

# do stuff on connect - I wanna load our messages
@socketio.on("connect")
def test_connect():
    s = request.sid
    socketio.emit("-------WE HAVE CONNECTED!-------", s)


# see when we disconnect
@socketio.on("disconnect")
def test_disconnect():
    socketio.emit("----WE HAVE DISCONNECTED!!!-------")


# connect to chat
@socketio.on("chat")
def handle_chat(data):
    # broadcast=True means that all users connected to this chat will see the message

    # add NEW message to the database
    message = Message(
        userId=data["userId"], channelId=data["channelId"], message=data["message"]
    )

    db.session.add(message)
    db.session.commit()
    new_MessageId = db.session.query(Message).order_by(Message.id.desc()).first()
    data["id"] = new_MessageId.id
    socketio.emit("chat", data, broadcast=True)


@socketio.on("edit")
def handle_edit(data):
    # data here is a single message

    message = Message.query.get(data["messageId"])

    # doublecheck that the actual user is editing their own message
    if data["userId"] == message.userId:

        message.message = data["message"]
        db.session.commit()
        socketio.emit("edit", data, broadcast=True)
    else:
        socketio.send({"Only the message author may edit this message"})


# join a chatroom
@socketio.on("join")
def on_join(data):

    # let's get room name by channelId
    channel = Channel.query.get(data["channelId"])

    username = data["username"]
    room = channel.title
    join_room(room)
    # to=room means that only someone connected to this room can see what's happening here
    socketio.send(username + " has entered the room", to=room)


# leave a chatroom
@socketio.on("leave")
def on_leave(data):
    channel = Channel.query.get(data["channelId"])

    username = data["username"]
    room = channel.title
    leave_room(room)
    socketio.send(username + " has left the channel.", to=room)
