const socket = io();
const startRoom = document.querySelector(`#start`);
const room = document.querySelector(`#room`);
const nickRoom = document.querySelector(`#nickname`);
const nickTitle = nickRoom.querySelector(`h3`);

room.hidden = true;
nickRoom.hidden = true;
let roomName;
let nickname;
function addMessage(message) {
  const ul = room.querySelector(`ul`);
  const li = document.createElement(`li`);
  li.innerText = message;
  ul.append(li);
}

function handleStartSubmit(e) {
  e.preventDefault();
  const rnameInput = startRoom.querySelector(`#rname`);
  const nickInput = startRoom.querySelector(`#nick`);
  socket.emit(`new_room`, rnameInput.value, nickInput.value, showRoom);
  roomName = rnameInput.value;
  nickname = nickInput.value;
  rnameInput.value = "";
  nickInput.value = "";
}

function handleMessageSubmit(e) {
  e.preventDefault();
  const input = room.querySelector(`input`);
  const message = input.value;
  socket.emit(`new_msg`, message, roomName, () => {
    addMessage(`You:${message}`);
  });
  input.value = "";
}

function handleChangeNick(e) {
  e.preventDefault();
  const nickInput = nickRoom.querySelector(`input`);
  let oldNick = nickname;
  nickname = nickInput.value;
  nickTitle.innerText = `Do you want to change your nickname? now : ${nickname}`;
  socket.emit(`new_nick`, nickInput.value, oldNick);
  nickInput.value = "";
}

function showRoom() {
  startRoom.hidden = true;
  room.hidden = false;
  nickRoom.hidden = false;
  const roomTitle = room.querySelector(`h3`);
  roomTitle.innerText = `Room : ${roomName}`;
  const msgForm = room.querySelector(`form`);
  msgForm.addEventListener(`submit`, handleMessageSubmit);
  nickTitle.innerText = `Do you want to change your nickname? now : ${nickname}`;
  const nickForm = nickRoom.querySelector(`form`);
  nickForm.addEventListener(`submit`, handleChangeNick);
}

function makeTitle(liveUser) {
  const roomTitle = room.querySelector(`h3`);
  roomTitle.innerText = `Room : ${roomName} (${liveUser})`;
}

socket.on(`welcome_msg`, (nick, liveUser) => {
  makeTitle(liveUser);
  addMessage(`Welcome to ${nick}`);
});
socket.on(`goodBye`, (nick, liveUser) => {
  makeTitle(liveUser);
  addMessage(`${nick} is left T.T`);
});
socket.on(`alertNickChange`, (newNick, oldNick) => {
  addMessage(`${oldNick} is change to ${newNick}`);
});

socket.on(`new_msg`, addMessage);
socket.on("room_change", (rooms) => {
  const roomList = startRoom.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});

startRoom.addEventListener(`submit`, handleStartSubmit);
