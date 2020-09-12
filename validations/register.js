const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = [];
  
  // data.email = !isEmpty(data.email) ? data.email : '';
  // data.password = !isEmpty(data.password) ? data.password : '';
  // data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  console.log(data.username);
  if (!data.username) {
    errors.push('Username field is required');
  }

  if (!data.password) {
    errors.push('Password field is required');
  }

  if (!data.password2) {
    errors.push('Confirm Password field is required');
  } else {
    if (!Validator.equals(data.password, data.password2)) {
      errors.push('Passwords must match');
    }
  }

  return {
    errors,
    anyErrors: errors.length
  };
};