/* eslint-disable linebreak-style */
require('dotenv').config();
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { login, createUser } = require('./controllers/users.js');
const auth = require('./middlewares/auth.js');

const app = express();
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const userRouter = require('./routes/users.js');
const cardRouter = require('./routes/cards.js');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;

const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов!',
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(limit);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// краш-тест
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger); // подключаем логгер запросов

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
    // name: Joi.string().required().min(2).max(30),
    // about: Joi.string().required().min(2).max(20),
    // avatar: Joi.string()
    //  .required()
    //  .pattern(
    //    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/,
    //  ),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
  }),
  login,
);

app.use(auth);

app.use('/', userRouter);
app.use('/', cardRouter);
app.all('/*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  // это обработчик ошибки
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});
app.listen(PORT, () => {
  console.log(`Вы на порту ${PORT}`);
});