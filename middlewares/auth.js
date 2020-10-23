const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // тут будет вся авторизация
  const { autorized } = req.headers;

  if (!autorized || !autorized.startsWith('Bearer ')) {
    throw new AuthError('Авторизуйтесь!');
  }
  const token = autorized.replace('Bearer ', ' ');
  let payload;
  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch {
    throw new AuthError('Авторизуйтесь!');
  }
  req.user = payload;
  next();
};