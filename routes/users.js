/* eslint-disable no-underscore-dangle */
const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {

  getUser,
  getUserById,

  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUser);
userRouter.get('/users/me', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
}), getUser);
userRouter.get('/users/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
}), getUserById);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);
userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/,
    ),

  }),
}), updateUserAvatar);

module.exports = userRouter;