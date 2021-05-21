const chatForm = document.getElementById("chat-form");
const chat = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// const {username, room} = Qs.parse(location.search,{
//     ignoreQueryPrefix : true
// })

const obj = Qs.parse(location.search,{
        ignoreQueryPrefix : true
})

const socket = io();
socket.emit("joinRoom",obj);

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

chatForm.addEventListener("submit",(e) => {
    e.preventDefault();

    const target = e.target.elements.msg.value;
    
    socket.emit("targetMsg",target);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

socket.on("msg",(message) => {
    //console.log("here : "+message);
    outputMessage(message);

    chat.scrollTop = chat.scrollHeight;
});

const outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector(".chat-messages").appendChild(div);
}

const outputRoomName = (room) => {
    roomName.innerHTML = room;
}

const outputUsers = (users) => {
    userList.innerHTML = `${users.map(user => `<li>${user.userName}</li>`).join("")}`
}