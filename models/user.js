const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    minlength: 2,
    validate: {
      validator(link) {
        return /https?:\/\/(www\.)?[a-zA-Z0-9-@#$%:._=+~&*\\]{1,333}\.[0-9A-Za-z]{1,4}\b([a-zA-Z0-9-@#$%:._=//()+~&*\\]*)/.test(
          link,
        );
      },
      message: (props) => `${props.value} ссылка не прошла валидацию.`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: (props) => `${props.value} почта не прошла валидацию.`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
});
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);