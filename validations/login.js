const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = [];

  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.username)) {
    errors.push('username field is required');
  }

  if (Validator.isEmpty(data.password)) {
    errors.push('Password field is required');
  }

  return {
    errors,
    anyErrors: errors.length
  };
};