from ..models.db import db, Server, Channel, Message


# Adds a demo user, you can add other users here if you want
def seed_servers():
    server1 = Server(
        master_admin = 1, name = "example", private=False, picture=None)

    db.session.add(server1)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_servers():
    db.session.execute('TRUNCATE servers RESTART IDENTITY CASCADE;')
    db.session.commit()
