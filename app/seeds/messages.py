from ..models.db import db, Server, Channel, Message


# Adds a demo user, you can add other users here if you want
def seed_messages():
    message1 = Message(
        userId = 1, channelId = 1, message = "Hello World")
    message2 = Message(
        userId = 1, channelId = 1, message = "Who loves javascript")
    message3 = Message(
        userId = 1, channelId = 1, message = "Nothing here")


    db.session.add(message1)
    db.session.add(message2)
    db.session.add(message3)



    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_messages():
    db.session.execute('TRUNCATE messages RESTART IDENTITY CASCADE;')
    db.session.commit()
