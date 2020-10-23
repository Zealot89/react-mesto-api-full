/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */

const Card = require('../models/card');
// const AuthError = require('../errors/auth-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const getCard = (req, res) => {
  Card.find({})
    .then((data) => {
      res.status(200).send({ data });
    }).catch(() => {
      throw new NotFoundError('Запрашиваемый ресурс не найден');
    })
    .catch(next);
  // .catch((err) => {
  //  const ERROR_CODE = 404;
//
  //  if (err.name === 'CastError') {
  //    res
  //      .status(ERROR_CODE)
  //      .send({ message: 'Запрашиваемый ресурс не найден' });
  //  }
  // });
};

const addCard = (req, res) => {
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
  // .catch((err) => {
  //  res
  //    .status(400)
  //    .send({
  //      message: 'переданы некорректные данные в метод создания карточки',
  //    });
  // });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(new Error('Not Found'))
    .then((card) => res.send({ data: card })).catch(() => {
      throw new NotFoundError('Переданы некорректные данные в метод удаления карточки');
    })
    .catch(next);
  // .catch((err) => {
  //  const ERROR_CODE = 404;
//
  //  if (err.name === 'CastError' || err.message === 'Not Found') {
  //    res
  //      .status(ERROR_CODE)
  //      .send({
  //        message: 'переданы некорректные данные в метод удаления карточки',
  //      });
  //  } else {
  //    res.status(500).send({ message: 'Ошибка на сервере' });
  //  }
  // });
};
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true },
  ).orFail(new Error('ValidationError'))
    .then((card) => res.send(card)).catch(() => {
      throw new NotFoundError('Карточка с таким Id не найдена');
    })
    .catch(next);
  // .catch((err) => {
  //  const ERROR_CODE = 404;
  //  if (err.message === 'ValidationError') {
  //    res.status(ERROR_CODE).send({ message: 'Карточка с таким Id не найдена' });
  //    return;
  //  }
  //  res.status(500).send({ message: 'Ошибка на сервере' });
  // });
};
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('ValidationError'))
    .then((card) => res.send(card)).catch(() => {
      throw new NotFoundError('переданы некорректные данные в метод создания пользователя');
    })
    .catch(next);
  // .catch((err) => {
  //  if (err.message === 'ValidationError') {
  //    res.status(404).send({ message: 'Карточка с таким Id не найдена' });
  //    return;
  //  }
  //  res.status(500).send({ message: 'Ошибка на сервере' });
  // });
};

module.exports = {
  getCard,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
};