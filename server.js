const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {userJoin, getUser, userLeave, getRoomUser} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname,"public")));
const port = 3000 || process.env.PORT;

const botName = "ChitChat App";

io.on("connection", (socketio) => {
    //console.log("Got new connecitons......");
    socketio.on("joinRoom",(obj) => {
        //console.log(obj.username+" ---- "+obj.room);
        const user = userJoin(socketio.id, obj.username, obj.room);
        socketio.join(user.room);
        socketio.emit("msg",formatMessage(botName,"Welcome in gossipy ;)"));
        socketio.broadcast.to(user.room).emit("msg",formatMessage(botName, `${user.userName} has joined :)`));
    
        io.to(user.room).emit('roomUsers', {
            room : user.room,
            users : getRoomUser(user.room)
        })
    })

    socketio.on("disconnect",() => {
        const user = userLeave(socketio.id);
        // for(const k in user){
        //     console.log(k);
        // }

        // console.log(`${user.userName} from left`);
        if(user){
            io.to(user.room).emit("msg",formatMessage(botName, `${user.userName} has left`));
        }
        
        io.to(user.room).emit('roomUsers', {
            room : user.room,
            users : getRoomUser(user.room)
        })
    });

    socketio.on("targetMsg", (m) => {
        const user = getUser(socketio.id);
        const hi = Object.keys(user);
        //console.log("hello ..."+hi);

        io.to(user.room).emit("msg",formatMessage(user.userName,m));
        //console.log(m);
    });
});

server.listen(port, () => console.log("App is running"));