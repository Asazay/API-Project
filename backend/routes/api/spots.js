const express = require('express');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const {requireAuth} = require('../../utils/auth');
const {User, Spot} = require('../../db/models');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const validateSpot = [
  requireAuth,
  check('address').exists({checkFalsy: true}).notEmpty()
  .withMessage('Street address is required'),
  check('city').exists({checkFalsy: true}).notEmpty()
  .withMessage('City is required'),
  check('state').exists({checkFalsy: true}).notEmpty()
  .withMessage('State is required'),
  check('country').exists({checkFalsy: true}).notEmpty()
  .withMessage('Country is required'),
  check('lat').exists({checkNull: true}).isFloat({
    min: -90,
    max: 90
  }).withMessage('Latitude must be within -90 and 90'),
  check('lng').exists({checkNull: true}).isFloat({
    min: -180,
    max: 180
  })
  .withMessage('Longitude must be within -180 and 180'),
  check('name').exists({checkFalsy: true}).notEmpty().isLength({
    min: 1,
    max: 49
  })
  .withMessage('Name must be less than 50 characters'),
  check('description').exists({checkFalsy: true}).notEmpty()
  .withMessage('Description is required'),
  check('price').exists({checkNull: true}).isFloat({
    min: 0
  }).withMessage('Price per day must be a positive number'),
handleValidationErrors,
];

const router = express.Router();

router.post('/', validateSpot, async (req, res, next) => {
  const spotOwner = await User.findByPk(req.user.id);

  const newSpot = await spotOwner.createSpot(req.body);

  if(newSpot) {
    res.status = 201;
    res.json(newSpot);
  }
});

module.exports = router;
