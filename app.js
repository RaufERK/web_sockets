require('dotenv').config();
var helmet = require('helmet');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const app = express();
const { messages, userFromSession } = require('./db/mongo');
const user = require('./routes/user');
const upLoad = require('./routes/upload');
const session = require('express-session');
const { secret, mongoUrl, PORT } = process.env;
const MongoStore = require('connect-mongo');
const { Messages, Users, mongoOption, dbConnect } = require('./db/mongo');

dbConnect();

app.set('view engine', 'hbs');
// app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(
  session({
    secret,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false },
    store: MongoStore.create({ mongoUrl }),
  })
);

app.use((req, res, next) => {
  res.locals.username = req.session.username;
  next();
});

const protection = (req, res, next) => {
  console.log('MIDLWARE => req.session.username = ', req.session.username);
  if (!req.session.username) return res.redirect('/user');
  next();
};

app.use('/user', user);
app.use('/upload', upLoad);

app.get('/', protection, async (req, res) => {
  console.log('GET / =====>>>>');
  const messages = await Messages.find();
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
  event.on('message', async (messageBody) => {
    //все сообщения прилетают и отправляются в тектовом формате
    console.log('ПОЛУЧИЛИ ССОБЩЕНИЕ ===>>>>', messageBody);
    const { username, message } = parser(messageBody);

    //записываем в базу автора и само сообщение
    await Messages.create({ username, message });

    //Пересылает полученое в чат сообщение всем клиентам (участникам)
    wsServer.clients.forEach((client) =>
      //посылаем в виде строки
      client.send(stringer({ username, message }))
    );
  });
});

app.listen(PORT || 3000, () => console.log('Server started!! PORT =>', PORT));
