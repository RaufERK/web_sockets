const express = require('express');
const app = express();
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const messages = [
  { user: 'Goshan', message: 'message' },
  { user: 'Gennad', message: 'message from Gennad' },
];
const userFromSession = 'Rauf';

app.route('/').get((req, res) => {
  res.render('index', { messages });
});

//подключаем вебСокеты
const WebSocket = require('ws');
//Создаё соединение на отдельном порту
const wsServer = new WebSocket.Server({ port: 8080 });

//маленькие функции-помошники
const stringer = (param) => JSON.stringify(param);
const parser = (param) => JSON.parse(param);

wsServer.on('connection', (event) => {
  // ПРОСЛУШИВАЕМ ВСЕ ССООБЩЕНИЯ ОТ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
  event.on('message', (messageBody) => {
    //все сообщения прилетают и отправляются в тектовом формате
    console.log('ПОЛУЧИЛИ ССОБЩЕНИЕ ===>>>>', messageBody);
    const { user, message } = parser(messageBody);

    //Пересылает полученое в чат сообщение всем клиентам (участникам)
    wsServer.clients.forEach((client) =>
      //посылаем в виде строки
      client.send(stringer({ user: userFromSession, message }))
    );

    //записываем в базу автора и само сообщение
    messages.push({ user, message });
  });

  //при соединении посылаем на фронт имя пользователя (из сесии)
  event.send(stringer({ user: userFromSession, command: 'SET_USER' }));
});

app.listen(3000, () => console.log('Server started!!'));
