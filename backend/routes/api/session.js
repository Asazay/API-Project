const express = require('express');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const {setTokenCookie, restoreUser} = require('../../utils/auth');
const {User} = require('../../db/models');

const router = express.Router();

router.post('/', async (req, res, next) => {
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
    const err = new Error('Login failed');
    err.status = 401;
    err.title = 'Login failed';
    err.errors = {
      credential: 'The provided credentials were invalid.'
    };

    return next(err);
  }

  const safeUser = {
    id: theUser.id,
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

module.exports = router;
