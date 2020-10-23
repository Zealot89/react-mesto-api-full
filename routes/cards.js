const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCard,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCard);
cardsRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), addCard);
cardsRouter.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), deleteCard);
cardsRouter.put('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), likeCard);
cardsRouter.delete('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = cardsRouter;