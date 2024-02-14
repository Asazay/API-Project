const {validationResult} = require('express-validator');

const handleValidationErrors = async (req, res, next) => {
  const validationErrors = {};

  if(!validationErrors.isEmpty()){
    const errors = {};

    validationErrors.array().forEach(err => errors[error.path] = error.msg);

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }

  next();
};

module.exports = {
  handleValidationErrors
}
