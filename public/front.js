const list = document.getElementById('list');
const userTitle = document.getElementById('userTitle');
const socket = new WebSocket('ws://localhost:8080');
const myUserName = document.getElementById('username').innerText;
console.log(' myUserName ====>>>', myUserName);
userTitle.innerHTML = ` user : <strong>${myUserName}</strong>`;

document.forms.chatForm.onsubmit = (event) => {
  event.preventDefault();
  const message = event.target.message.value;
  event.target.message.value = '';
  socket.send(JSON.stringify({ username: myUserName, message }));
};

//ОБработчик сокет-событий => при устанновлени соединения
socket.onopen = () => {
  console.log('Соединение установлено  !!!!!');
};

//Обработчик на случай получения сообщения
socket.onmessage = (event) => {
  console.log(`[message] Данные получены с сервера: ${event.data}`);
  const { username, message } = JSON.parse(event.data);
  list.innerHTML += `<li><div class='msg'>${username}</div><div class='msg'>${message}</div></li>`;
};

//Обработчик на случай разрыва соединения
socket.onclose = (event) => {
  console.log(' EVENT ==>', event);
  if (event.wasClean) {
    console.log(
      `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
    );
  } else {
    // например, сервер убил процесс или сеть недоступна
    console.log('[close] Соединение прервано');
  }
};

//Обработчик в случае ошибки
socket.onerror = (error) => {
  console.log(`[error] ${error.message}`);
};
