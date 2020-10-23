/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../errors/auth-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res) => {
  User.find({})
    .then((data) => {
      res.status(200).send({ data });
    }).catch(next);
  // .catch(() => {
  //  throw new NotFoundError('Запрашиваемый ресурс не найден');
  //   const ERROR_CODE = 404;
  //
  //   if (err.name === 'CastError') {
  //    res
  //      .status(ERROR_CODE)
  //      .send({ message: 'Запрашиваемый ресурс не найден' });
  //   } else {
  //    res.status(500).send({ message: 'Ошибка на сервере' });
  //   }
  // });
};

const getUserById = (req, res) => {
  User.findById(req.params._id)
    .orFail(new Error('Not Found'))
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch(() => {
      throw new NotFoundError('Пользователь не найден');
    //  const ERROR_CODE = 404;
      //
    //  if (err.name === 'CastError' || err.message === 'Not Found') {
    //    res.status(ERROR_CODE).send({ message: 'пользователь не найден' });
    //  } else {
    //    res.status(500).send({ message: 'Ошибка на сервере' });
    //  }
    })
    .catch(next);
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      });
    })

    .then((data) => {
      res.send({
        _id: data._id,
        name: data.name,
        about: data.about,
        avatar: data.avatar,
        email: data.email,
      });
    }).catch(() => {
      throw new BadRequestError('переданы некорректные данные в метод создания пользователя');
    })
    .catch(next);
  // .catch((err) => {
  //  const ERROR_CODE = 400;
  //  if (err.name === 'ValidationError') {
  //    res
  //      .status(ERROR_CODE)
  //      .send({
  //        message:
  //          'переданы некорректные данные в метод создания пользователя',
  //      });
  //  } else {
  //    res.status(500).send({ message: 'Ошибка на сервере' });
  //  }
  // });
};
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('CastError'))
    .then((user) => {
      res.send(user);
    }).catch(() => {
      throw new NotFoundError('Пользователь с таким Id не найден');
    })
    .catch(next);
  // .catch((err) => {
  //  const ERROR_CODE = 404;
  //  if (err.message === 'CastError') {
  //    console.log(req);
  //    res
  //      .status(ERROR_CODE)
  //      .send({
  //        message:
  //        'Пользователь с таким Id не найден',
  //      });
  //  } else {
  //    res.status(500).send({ message: 'Ошибка на сервере' });
  //  }
  // });
};
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('CastError'))
    .then((user) => {
      res.send(user);
    }).catch(() => {
      throw new NotFoundError('Пользователь с таким Id не найден');
    })
    .catch(next);
  // .catch((err) => {
  //  const ERROR_CODE = 404;
  //  if (err.message === 'CastError') {
  //    res
  //      .status(ERROR_CODE)
  //      .send({
  //        message:
  //        'Пользователь с таким Id не найден',
  //      });
  //  } else {
  //    res.status(500).send({ message: 'Ошибка на сервере' });
  //  }
  // });
};

function login(req, res, next) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password).then((user) => {
    res.send({ token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }) });
  }).catch((err) => {
    // ошибка аутентификации
    throw new AuthError(err.message);
    // res
    //  .status(401)
    //  .send({ message: err.message });
  }).catch(next);
}

module.exports = {
  login,
  getUser,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};