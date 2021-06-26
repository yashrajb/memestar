

exports.validateRegisterInput = function (data) {
  let error = '';
  if (!data.username) {
    error = 'Username field is required';
  }

  if (!data.password && !error) {
    error = 'Password field is required' ;
  }

  if (!data.password2 && !error) {
    error = 'Confirm Password field is required';
  }
  
 if (data.password != data.password2 && !error) {
      error = 'Passwords must match' ;
 }
  


  return {
    errors:error,
    anyErrors:error?true:false
  };
};


exports.validateLoginInput = function (data) {
  let error = ''

  if (!data.username && !error) {
   error = 'username field is required';
  }

  if (!data. password && !error) {
    error = 'Password field is required';
  }

  return {
    errors:error,
    anyErrors: error?true:false
  };
};