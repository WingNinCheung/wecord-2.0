# Wecord 2.0

Wecord 2.0 is a full-stack web application inspired by Discord. Users can join communities or create their own community and chat through live messaging.

Wecord 2.0 is an improved and revised version from my group project <a href="https://github.com/WingNinCheung/Wecord">Wecord</a> which does not support live chat. I continued working on Wecord indivdually, adding new features and improving functionalities.

Live site: <a href="https://wecord-2.onrender.com">Wecord 2.0</a>

Documentation: <a href="https://github.com/WingNinCheung/wecord-2.0/wiki">Wiki</a>

## Technologies used

### Frontend
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

### Backend
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

## How to Install and Run
- Clone this repository
  - Navigate to a directory in your terminal and run:
```
git clone https://github.com/WingNinCheung/wecord-2.0.git
```
- Install dependencies
  - Navigate to /wecord-2.0 and run:
```
pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
```
  - Navigate to /wecord-2.0/react-app and run:
```
npm install
```

- Setup a new PostgreSQL user, password and database 
  - In your terminal, run:
```
psql
CREATE USER <user_name> WITH CREATEDB PASSWORD '<your_password>'
CREATE DATABASE <db_name> WITH OWNER <user_name>
```

- Create a .env file in the root
  - Copy /wecord-2.0/.env.example to .env
```
// .env 
FLASK_APP=app
FLASK_ENV=development
SECRET_KEY=lkasjdf09ajsdkfljalsiorj12n3490re9485309irefvn,u90818734902139489230
DATABASE_URL=postgresql://<user_name>:<password>@localhost/<database_name>
FLASK_RUN_PORT=8080
```

- Migrate and seed the database
  - In your terminal, go to /wecord-2.0 and run:
```
pipenv shell
flask db upgrade && flask seed all
```

- Run both frontend and backend
  - In your terminal, go to /wecord-2.0 and run:
```
flask run
```
  - In your terminal, go to /wecord-2.0/react-app and run:
```
npm start
```

## Main Improved Functionalities & Features

### Messaging with Full CRUD in Live Time

- Create
  - Users can send messages in channels.
- Read
  - Users can read messages in a channel in real time. Only the users in that channel can view the messages.
  - It is achieived by the join_room and leave_room functions from Socket.io.
- Update
  - Users can edit their messages in real time. All users in that channel are able to see the changes made in real time.
- Delete
  - Users can delete their messages. 

### Chat Rooms for Channels

- Messages can only be read by users at the same channels.
- It is achieived by the join_room and leave_room functions from Socket.io.

```
// frontend
socket.emit("join", { username: user.id, channelId: channelId });
socket.on("join", async (data) => {
  setChatRoom(data[user.id]);
});

// function will be invoked when user clicks the Send button
const sendChat = async (e) => {
    e.preventDefault();

    ...
    ...
        socket.emit("chat", {
          user: user.username,
          message: chatInput,
          userId: user.id,
          channelId: channelId,
          room: chatRoom,
        });
      }
    }

// backend

@socketio.on("join")
def on_join(data):
    global lobby
    userId = data["username"]
    room = data["channelId"]
    lobby[userId] = room
    join_room(lobby[userId])
    socketio.emit("join", lobby)
    
@socketio.on("chat")
def handle_chat(data):
    # global room
    message = Message(
        userId=data["userId"], channelId=data["channelId"], message=data["message"]
    )
    db.session.add(message)
    db.session.commit()
    # messages are sent to the room only
    socketio.emit("chat", data, room=data["room"])
```

### Automatic Scroll Down to the Bottom on Chat

- The chat feed automatically scrolls to the bottom when a new message is sent/received using **useRef** hook.
- Users do not need to scroll down to look for new messages.

```
const messageEl = useRef(null);

// Auto scroll to bottom when new messages come in
  useEffect(() => {
    messageEl.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);


messages.map((message, i) =>
  message.message ? (
    <div key={i} className="singleMessageDisplay">
      <div className="username">
        <i className="fa-solid fa-user"></i>
          {message.user}
      </div>
      ...
      ...
      <div key={i} ref={messageEl}></div>
```

### Press Enter to Send Messages

  - To send out a message, user can either click the Send button or press "Enter" on the keyboard
  
```
// Allow users to press enter to send out messages
  useEffect(() => {
    const keyHandler = (event) => {
      if (event.key === "Enter") {
        sendChat(event);
      }
    };
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("keydown", keyHandler);
    };
  });
  
```

## Technical Challenges
<a href="https://github.com/WingNinCheung/Wecord">Wecord</a> brought many challenges to my team, primarily implementing web sockets. We did implement the live chat, but it caused a lot of bugs on editing and deleting messages. We decide to remove the live chat feature.

For Wecord 2.0, I faced many challengings on creating chat rooms. One of the blocks was everytime when a user clicked a channel(A), the room was assigned. But when another users clicked a different channel(B), the room was assigned again. When the first user sent a message in channel A, the message wasn't shown in channel A but channel B.

I solved this issue by using a lobby object that contains the user'id as the key and room (channel's id) as the value. Everytime when a user clicks a channel, it will search on the lobby object with the user's id and assign the selected channel's id to room. The lobby will look like:
```
// The keys and values are the users'id and channels'id
lobby = {
  "1" : "100",
  "3" : "200",
  ...
}
```
Thus, even different users clicks different channels at the same time, it will find and assign the new rooms based on their **unique** users' id in O(1) time complexity.
Therefore, the message will be broadcasted to that room only.

## To-dos/Future Features

  - Private Messaging
  - Allows users to send images in chat
  - Add emoji in the message box


