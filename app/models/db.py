from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import Column, ForeignKey, Table
from sqlalchemy.types import Integer, String, Boolean
from sqlalchemy.orm import relationship
import os

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


db = SQLAlchemy()


def add_prefix_for_prod(attr):
    if environment == "production":
        return f"{SCHEMA}.{attr}"
    else:
        return attr


class Friend(db.Model):
    __tablename__ = "friends"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id = db.Column(db.Integer, primary_key=True)
    userId = Column(Integer, nullable=False)
    friendId = Column(
        Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    accepted = Column(Boolean, default=False)

    user = relationship("User", back_populates="friends")

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "friendId": self.friendId,
            "accepted": self.accepted,
        }


class Server_User(db.Model):
    __tablename__ = "serverusers"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id = db.Column(db.Integer, primary_key=True)
    serverId = Column(
        Integer, db.ForeignKey(add_prefix_for_prod("servers.id")), nullable=False
    )
    userId = Column(
        Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    adminStatus = Column(Boolean, default=False)
    muted = Column(Boolean, default=False)

    server = relationship("Server", back_populates="users")
    user = relationship("User", back_populates="server")

    def to_dict(self):
        return {
            "id": self.id,
            "serverId": self.serverId,
            "userId": self.userId,
            "adminStatus": self.adminStatus,
            "muted": self.muted,
        }


class Server(db.Model):
    __tablename__ = "servers"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    master_admin = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    name = db.Column(db.String(50), nullable=False)
    private = db.Column(db.Boolean, nullable=False)
    picture = db.Column(db.Text)

    # relationships
    users = relationship("Server_User", back_populates="server", cascade="all, delete")
    channels = relationship("Channel", back_populates="server", cascade="all, delete")
    masterAdmin = relationship("User", back_populates="servers")

    # automatically create a default channel named general
    def __init__(self, **kwargs):
        super(Server, self).__init__(**kwargs)
        self.channels.append(Channel(serverId=self.id, title="general"))

    def to_dict(self):
        return {
            "id": self.id,
            "master_admin": self.master_admin,
            "name": self.name,
            "private": self.private,
            "picture": self.picture,
            "channels": [channel.to_dict() for channel in self.channels],
        }


class Channel(db.Model):
    __tablename__ = "channels"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = Column(Integer, primary_key=True)
    serverId = Column(
        Integer, ForeignKey(add_prefix_for_prod("servers.id")), nullable=False
    )
    title = Column(String(30), nullable=False)

    # relationships
    server = relationship("Server", back_populates="channels")
    messages = relationship("Message", back_populates="channel", cascade="all, delete")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "serverId": self.serverId,
            "messages": [message.to_dict() for message in self.messages],
        }


class Message(db.Model):
    __tablename__ = "messages"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = Column(Integer, primary_key=True)
    userId = Column(
        Integer, ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    channelId = Column(
        Integer, ForeignKey(add_prefix_for_prod("channels.id")), nullable=False
    )
    message = Column(String(1500), nullable=False)

    # relationships
    user = relationship("User", back_populates="messages")
    channel = relationship("Channel", back_populates="messages")

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "channelId": self.channelId,
            "message": self.message,
        }
