const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { requireAuth } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSpot = [
  requireAuth,
  check('address').exists({ checkFalsy: true }).notEmpty()
    .withMessage('Street address is required'),
  check('city').exists({ checkFalsy: true }).notEmpty()
    .withMessage('City is required'),
  check('state').exists({ checkFalsy: true }).notEmpty()
    .withMessage('State is required'),
  check('country').exists({ checkFalsy: true }).notEmpty()
    .withMessage('Country is required'),
  check('lat').isFloat({
    min: -90,
    max: 90
  }).withMessage('Latitude must be within -90 and 90'),
  check('lng').isFloat({
    min: -180,
    max: 180
  })
    .withMessage('Longitude must be within -180 and 180'),
  check('name').isLength({
    min: 0,
    max: 49
  })
    .withMessage('Name must be less than 50 characters'),
  check('description').exists({ checkFalsy: true }).notEmpty()
    .withMessage('Description is required'),
  check('price').isFloat({
    min: 0,
    max: 9999999999,
  }).withMessage('Price per day must be a positive number'),
  handleValidationErrors,
];

const router = express.Router();

router.post('/', validateSpot, async (req, res, next) => {
  const spotOwner = await User.findByPk(req.user.id);

  const newSpot = await spotOwner.createSpot(req.body);

  if (newSpot) {
    res.status = 201;
    res.json(newSpot);
  }
});

router.put('/:spotId', validateSpot, async (req, res, next) => {
  const { spotId } = req.params;
  const currUserId = req.user.id;

  let theSpot = await Spot.findByPk(spotId);

  if (!theSpot) {
    const err = new Error("Spot couldn't be found");
    err.title = "Spot couldn't be found";
    err.errors = {
      message: "Spot couldn't be found"
    }
    err.status = 404;
    return next(err);
  }

  if (theSpot.ownerId !== currUserId) {
    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    res.status(401);
    return next(err);
  }

  const editSpot = await theSpot.update(req.body);

  res.json(editSpot)
});

module.exports = router;
