const users = [];

const addUser = ({name, room}) => {
    const user = {name, room};
    users.push(user);
    return { user };
}

const removeUser = (name) => {
    const index = users.findIndex((user) => user.name === name);
    if(index !== (-1)) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (name) => {
    users.find((user) => user.name === name);
}

const getUsersInRoom = (room) => {
    users.filter((user) => user.room === room);
}

module.exports = {addUser, removeUser, getUser, getUsersInRoom };