const chatForm = document.getElementById('chatForm');
const list = document.getElementById('list');
const userTitle = document.getElementById('userTitle');
const socket = new WebSocket('ws://localhost:8080');
let userFront = null;

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = event.target.message.value;
  event.target.message.value = '';
  socket.send(JSON.stringify({ user: userFront, message }));
});

//ОБработчик сокет-событий => при устанновлени соединения
socket.onopen = function (e) {
  console.log('Соединение установлено  !!!!!');
};

//Обработчик на случай получения сообщения
socket.onmessage = function (event) {
  console.log(`[message] Данные получены с сервера: ${event.data}`);
  const { user, message, command } = JSON.parse(event.data);

  //при первом подключении получаем имя пользователя под которым авторизовались
  if (command === 'SET_USER') {
    userTitle.innerText = `USER : ${user}`;
    userFront = user;
  } else {
    list.innerHTML += `<li><div class='msg'>${user}</div><div>${message}</div></li>`;
  }
};

//Обработчик на случай разрыва соединения
socket.onclose = function (event) {
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
socket.onerror = function (error) {
  console.log(`[error] ${error.message}`);
};
