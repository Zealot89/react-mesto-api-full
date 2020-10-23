module.exports = {

  env: {

    browser: true,

    commonjs: true,

    es2021: true,

  },

  extends: [

    'airbnb',

  ],

  parserOptions: {

    ecmaFeatures: {

      jsx: true,

    },

    ecmaVersion: 12,

  },

  plugins: [

  ],

  rules: {
    'no-underscore-dangle': ['error', {

      allow: ['foo_', '_bar'],

      allowAfterThis: true,

      allowAfterSuper: true,

      allowAfterThisConstructor: true,

    }],

    'eol-last': ['error', 'never'],
    'linebreak-style': 0,

  },

};