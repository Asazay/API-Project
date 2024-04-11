const express = require('express');
const bcrypt = require('bcryptjs');
const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User} = require('../../db/models');
const {check} = require('express-validator');
const {handleValidationErrors, handleExistsErrors} = require('../../utils/validation');

const validateSignup = [
  check('email').exists({checkFalsy: true})
  .isEmail().withMessage('Please provide a valid email.'),
  check('username').exists({checkFalsy: true})
  .isLength({min: 4})
  .withMessage('Please provide a username with at least 4 characters.'),
  check('username').not().isEmail().withMessage('Username cannot be an email.'),
  check('password').exists({checkFalsy: true}).isLength({min: 6})
  .withMessage('Password must be 6 characters or more.'),
  check('firstName').exists({checkFalsy: true})
  .withMessage('First name is required'),
  check('lastName').exists({checkFalsy: true})
  .withMessage('Last name is required'),
  
  check('email').custom(async value => {
    let itExists = await User.findOne({where:{email:value}});
    if(itExists) throw new Error('User with that email already exists');
  }).withMessage('User with that email already exists'),
  check('username').custom(async value => {
    let itExists = await User.findOne({where:{username:value}});
    if(itExists) throw new Error('User with that username already exists');
  }).withMessage('User with that username already exists'),
  handleValidationErrors,
  handleExistsErrors
];

const router = express.Router();

router.post('/', validateSignup, async (req, res, next) => {
  const {firstName, lastName, email, username, password} = req.body;

  const hashedPassword = bcrypt.hashSync(password);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    username,
    hashedPassword
  });

  const safeUser = {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    username: newUser.username
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
});

module.exports = router;
