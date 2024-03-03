const {validationResult} = require('express-validator');

const handleValidationErrors = async (req, res, next) => {
  const validationErrors = validationResult(req);

  if(!validationErrors.isEmpty()){
    const errors = {};

    validationErrors.array().forEach(error => errors[error.path] = error.msg);

    const err = new Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    next(err);
  }

  next();
};

const handleExistsErrors = async (req, res, next) => {
  const existsErrors = validationResult(req);

  if(!existsErrors.isEmpty()){
    const errors = {};

    existsErrors.array().forEach(error => errors[error.path] = error.msg);

    const err = new Error('User already exists');
    err.errors = errors;
    err.status = 500;
    err.title = "User already exists";
    next(err);
  }

  next();
};



module.exports = {
  handleValidationErrors, handleExistsErrors
}
