/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */

const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const getCard = (req, res, next) => {
  Card.find({})
    .then((data) => {
      res.status(200).send({ data });
    }).catch(() => {
      throw new NotFoundError('Запрашиваемый ресурс не найден');
    })
    .catch(next);
};

const addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((data) => {
      res.send(data);
    }).catch(() => {
      throw new BadRequestError('Переданы некорректные данные в метод создания карточки');
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params._id)
    .orFail(new Error('Not Found'))
    .then((card) => res.send({ data: card })).catch(() => {
      throw new NotFoundError('Переданы некорректные данные в метод удаления карточки');
    })
    .catch(next);
};
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true },
  ).orFail(new Error('ValidationError'))
    .then((card) => res.send(card)).catch(() => {
      throw new NotFoundError('Карточка с таким Id не найдена');
    })
    .catch(next);
};
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('ValidationError'))
    .then((card) => res.send(card)).catch(() => {
      throw new NotFoundError('переданы некорректные данные в метод создания пользователя');
    })
    .catch(next);
};

module.exports = {
  getCard,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
};