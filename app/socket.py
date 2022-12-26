from flask_socketio import SocketIO, join_room, leave_room
from flask import request, jsonify
import os, json
from .models.db import db, Message, Channel
from .api.server_routes import get_channel_messages

# from app.__init__ import app
# from app import app

# Session(app)
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
# room = []
lobby = {}
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
    # global room
    message = Message(
        userId=data["userId"], channelId=data["channelId"], message=data["message"]
    )

    db.session.add(message)
    db.session.commit()
    new_MessageId = db.session.query(Message).order_by(Message.id.desc()).first()
    data["id"] = new_MessageId.id
    socketio.emit("chat", data, room=data["room"])


@socketio.on("edit")
def handle_edit(data):
    # data here is a single message
    global room
    message = Message.query.get(data["messageId"])

    # doublecheck that the actual user is editing their own message
    if data["userId"] == message.userId:

        message.message = data["message"]
        db.session.commit()
        socketio.emit("edit", data, room=data["room"])
    else:
        socketio.send({"Only the message author may edit this message"})


# join a chatroom
@socketio.on("join")
def on_join(data):
    global lobby
    # let's get room name by channelId
    channel = Channel.query.get(data["channelId"])

    userId = data["username"]
    # room = channel.title
    room = data["channelId"]
    lobby[userId] = room
    # join_room(room)
    join_room(lobby[userId])
    socketio.emit("join", lobby)
    # to=room means that only someone connected to this room can see what's happening here
    socketio.send(userId, " has entered the room")


# leave a chatroom
@socketio.on("leave")
def on_leave(data):
    global room
    username = data["username"]
    # room = channel.title
    leave_room(room)
    socketio.send(username + " has left the channel.", to=room)
