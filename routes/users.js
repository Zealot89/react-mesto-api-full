/* eslint-disable no-underscore-dangle */
const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  // login,
  getUser,
  getUserById,
  // createUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUser);
userRouter.get('/users/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), getUserById);
// userRouter.post('/users', createUser);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);
userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),

  }),
}), updateUserAvatar);
// userRouter.post('/signin', login);
// userRouter.post('/signup', createUser);

module.exports = userRouter;