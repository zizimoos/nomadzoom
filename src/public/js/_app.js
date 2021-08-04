const messageList = document.querySelector("ul");
const nickNameForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("connected to server ✅");
});
socket.addEventListener("message", (message) => {
  //   console.log("New message :", message.data);
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});
socket.addEventListener("close", () => {
  console.log("🔴 disconnected from server");
});

const makeMessages = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};

const handleSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessages("new_message", input.value));
  const li = document.createElement("li");
  li.innerText = `You : ${input.value}`;
  messageList.append(li);
  input.value = "";
};

const handleNickNameSubmit = (event) => {
  event.preventDefault();
  const input = nickNameForm.querySelector("input");
  socket.send(makeMessages("nickname", input.value));
  input.value = "";
};

messageForm.addEventListener("submit", handleSubmit);
nickNameForm.addEventListener("submit", handleNickNameSubmit);
