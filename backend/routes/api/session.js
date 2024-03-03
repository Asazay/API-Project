const express = require('express');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const {setTokenCookie, restoreUser} = require('../../utils/auth');
const {User} = require('../../db/models');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const validateLogin = [
  check('credential').exists({checkFalsy: true})
  .notEmpty().withMessage('Email or username is required'),
  check('password').exists({checkFalsy: true})
  .withMessage('Password is required'),
  handleValidationErrors
];

const router = express.Router();

router.post('/', validateLogin, async (req, res, next) => {
  const {credential, password} = req.body;

  const theUser = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential
      }
    }
  });

  if(!theUser || !bcrypt.compareSync(password, theUser.hashedPassword.toString())){
    const err = new Error('Invalid credentials');
    err.status = 401;
    res.status(err.status).send({message: err.message})
  }

  const safeUser = {
    id: theUser.id,
    firstName: theUser.firstName,
    lastName: theUser.lastName,
    email: theUser.email,
    username: theUser.username,
  };

  setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
});

router.delete('/', async (req, res, next) => {
  res.clearCookie('token');
  return res.json({message: 'success'});
});

router.get('/', async (req, res, next) => {
  const {user} = req;

  if(user){
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    return res.json({
      user: safeUser
    });

  }

  else return res.json({user: null});
});

module.exports = router;
