/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../errors/auth-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.status(200).send({ data });
    }).catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params._id)
    .orFail(new Error('Not Found'))
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))

    .then((newUser) => {
      res.send({
        _id: newUser._id,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      });
    }).catch((error) => {
      if (error.name === 'MongoError' || error.code === 11000) {
        throw new ConflictError('переданы некорректные данные в метод создания пользователя');
      }
      throw new BadRequestError('переданы некорректные данные в метод создания пользователя');
    })
    .catch(next);
};
const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('CastError'))
    .then((user) => {
      res.send(user);
    }).catch(() => {
      throw new NotFoundError('Пользователь с таким Id не найден');
    })
    .catch(next);
};
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('CastError'))
    .then((user) => {
      res.send(user);
    }).catch(() => {
      throw new NotFoundError('Пользователь с таким Id не найден');
    })
    .catch(next);
};

function login(req, res, next) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password).then((user) => {
    res.send({ token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }) });
  }).catch((err) => {
    // ошибка аутентификации
    throw new AuthError(err.message);
  })
    .catch(next);
}

module.exports = {
  login,
  getUser,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};