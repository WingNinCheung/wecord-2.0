from ..models.db import db, Server, Channel, Message, Server_User


# Adds a demo user, you can add other users here if you want
def seed_server_users():
    server_users1 = Server_User(
        serverId = 1, userId = 1, adminStatus = True, muted = False )
    server_users2 = Server_User(
        serverId = 1, userId = 2, adminStatus = False, muted = False )
    server_users3 = Server_User(
        serverId = 1, userId = 3, adminStatus = False, muted = False )

    db.session.add(server_users2)
    db.session.add(server_users1)
    db.session.add(server_users3)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_server_users():
    db.session.execute('TRUNCATE serverusers RESTART IDENTITY CASCADE;')
    db.session.commit()
