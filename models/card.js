const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return /https?:\/\/(www\.)?[a-zA-Z0-9-@#$%:._=+~&*\\]{1,333}\.[0-9A-Za-z]{1,4}\b([a-zA-Z0-9-@#$%:._=//()+~&*\\]*)/.test(link);
      },
      message: (props) => `${props.value} ссылка не прошла валидацию.`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);