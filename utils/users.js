const users = [];

const userJoin = (id, userName, room) => {
    const user = {id, userName, room};
    users.push(user);
    return user;
}

// const user = {age : 12,name : "deval",rollno : 32};
// const hi = Object.keys(user);
// console.log(hi);

const userLeave = (id) => {
    const index = users.find(u => u.id == id);
    
    if(index == -1)
    {
        return users.splice(index,1)[0];
    }

    return index;
}


const getRoomUser = (room) => {
    return users.filter(u => u.room == room);
}

const getUser = (id) => {
    return users.find(u => u.id == id);
}

module.exports = {
    userJoin,
    getUser,
    userLeave,
    getRoomUser
};