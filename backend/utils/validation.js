const {validationResult} = require('express-validator');

const handleValidationErrors = async (req, res, next) => {
  const validationErrors = validationResult(req);

  if(!validationErrors.isEmpty()){
    const errors = {};

    validationErrors.array().forEach(error => errors[error.path] = error.msg);

    return res.status(400).send({
      message: 'Bad Request',
      errors
    });
  }

  next();
};

const handleExistsErrors = async (req, res, next) => {
  const existsErrors = validationResult(req);

  if(!existsErrors.isEmpty()){
    const errors = {};

    existsErrors.array().forEach(error => errors[error.path] = error.msg);

    return res.status(500).send({
      message: "User already exists",
      errors
    })
  }

  next();
};



module.exports = {
  handleValidationErrors, handleExistsErrors
}
