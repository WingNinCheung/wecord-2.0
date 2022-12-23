from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user

from ..models.db import Server_User, db, Server, Channel, Message
from ..models.user import User

server_routes = Blueprint("server_routes", __name__)

# GET /api/servers - read all servers
@server_routes.route("/yourServers/<int:userId>")
@login_required
def all_servers(userId):
    # get all server_user instances for a single user
    serverUsers = Server_User.query.filter(Server_User.userId == userId).all()

    # Get user object for current user
    currentUser = User.query.get(userId)
    # get all servers, fill notIn with servers the user is not a member of
    servers = Server.query.all()
    notIn = []
    serverspub = Server.query.filter(Server.private == False).all()
    for server in serverspub:
        bool = True
        for use in server.users:
            if currentUser == use.user:
                bool = False
        if bool:
            notIn.append(server)

    return {
        "servers": [server.to_dict() for server in servers],
        "yourservers": [server.server.to_dict() for server in serverUsers],
        "serversnotin": [server.to_dict() for server in notIn],
    }


# POST /api/servers - create a new public server
@server_routes.route("/add", methods=["POST"])
@login_required
def new_server():
    name = request.json["name"]
    private = request.json["private"]
    picture = request.json["picture"]
    master_admin = request.json["master_admin"]

    server = Server(
        name=name,
        private=private,
        picture=picture,
        master_admin=master_admin,
    )

    db.session.add(server)
    db.session.commit()

    server_user = Server_User(
        serverId=server.id, userId=server.master_admin, adminStatus=True, muted=False
    )

    db.session.add(server_user)
    db.session.commit()
    return server.to_dict()


# PUT /api/servers/:serverId - update server info
@server_routes.route("/<int:id>/edit", methods=["PUT"])
@login_required
def edit_server(id):
    server = Server.query.get(id)
    data = request.json
    server.name = data["name"]
    db.session.commit()
    return server.to_dict()


# DELETE /api/servers/:serverId - delete a server
@server_routes.route("/<int:serverId>/<int:userId>/delete", methods=["DELETE"])
def delete_server(serverId, userId):

    server = Server.query.get(serverId)
    # Check that the user submitting request is the master admin
    if userId == server.master_admin:
        db.session.delete(server)
        db.session.commit()
        return server.to_dict()
    else:
        return jsonify({"Only the server admin may delete this server"})


@server_routes.route("/private/<int:userId>")
def checkUserInServer(userId):
    serverUsers = Server_User.query.filter(Server_User.userId == userId).all()
    return {"yourservers": [server.server.to_dict() for server in serverUsers]}


# ------------------------- Routes for channels -------------------------------------
# read all channels of a single server
@server_routes.route("/<int:id>/channels")
@login_required
def get_server_channels(id):
    server = Server.query.get(id)
    if server:
        serverchannels = server.to_dict()
        return {"channels": serverchannels["channels"]}


# create a new channel in a server
@server_routes.route("/<int:serverId>/channels/create", methods=["post"])
@login_required
def create_channels(serverId):

    newChannel = Channel(title=request.json["title"], serverId=request.json["serverId"])

    db.session.add(newChannel)
    db.session.commit()
    return newChannel.to_dict()


# edit a channel
@server_routes.route("/<int:id>/channels/<int:channelId>/edit", methods=["PUT"])
@login_required
def channels_edit(id, channelId):

    # channel = Channel.query.filter(Channel.id == channelId).all()
    channel = Channel.query.get(channelId)
    title = request.json["title"]
    channel.title = title
    db.session.add(channel)
    db.session.commit()
    return channel.to_dict()


# delete a channel
@server_routes.route(
    "/<int:serverId>/channels/<int:channelId>/delete", methods=["DELETE"]
)
@login_required
def delete_channel(serverId, channelId):

    channel = Channel.query.filter(Channel.id == channelId).all()
    db.session.delete(channel[0])
    # target_channel.delete()
    db.session.commit()
    # return jsonify({"Already deleted"})
    return jsonify(channelId)


@server_routes.route("/channels/<int:id>")
@login_required
def get_channel_messages(id):
    channel = Channel.query.get(id)
    target_channel = channel.to_dict()

    # use a for loop to append the corresponding username and photo to each message
    for i, message in enumerate(target_channel["messages"]):
        message["user"] = channel.messages[i].user.username
        message["userPhoto"] = channel.messages[i].user.photo
    return {"messages": target_channel["messages"]}
