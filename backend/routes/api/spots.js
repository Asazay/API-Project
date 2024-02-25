const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { requireAuth, checkAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');
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

const checkAuthorization = [requireAuth, handleValidationErrors];

const router = express.Router();

router.post('/', validateSpot, async (req, res, next) => {
  const spotOwner = await User.findByPk(req.user.id);

  const newSpot = await spotOwner.createSpot(req.body);

  if (newSpot) {
    res.status = 201;
    res.json(newSpot);
  }
});

router.get('/current', requireAuth, async (req, res, next) => {
  let allSpots = await Spot.findAll({
    where: {
      ownerId: req.user.id
    },
    include: [
      {
        model: SpotImage,
        attributes: ['url']
      }
    ]
  });

  let daSpots = [];

  for(let i = 0; i < allSpots.length; i++){
    let currSpot = allSpots[i].toJSON();

    let count = await Review.count({where: {spotId: currSpot.id}});
    let totalStars = await Review.sum('stars', {where: {spotId: currSpot.id}});

    if(!count) currSpot.avgRating = null;
    else currSpot.avgRating = totalStars/count;

    if(!currSpot.SpotImages.length) currSpot.previewImage = null;
    if(currSpot.SpotImages.length) currSpot.previewImage = currSpot.SpotImages[0].url
    delete currSpot.SpotImages;

    daSpots.push(currSpot);
  }

  res.json({ Spots: daSpots });
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

  if (!checkAuth(currUserId, theSpot.ownerId)) {
    const err = new Error('Authorization required');
    err.title = 'Authorization required';
    err.errors = { message: 'Authorization required' };
    err.status = 403;
    res.status(403);
    return next(err);
  }

  const editSpot = await theSpot.update(req.body);

  res.json(editSpot)
});

router.post('/:spotId/images', checkAuthorization, async (req, res, next) => {
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

  const isAuthorized = checkAuth(currUserId, theSpot.ownerId);

  if (!isAuthorized) {
    const err = new Error('Authorization required');
    err.title = 'Authorization required';
    err.errors = { message: 'Authorization required' };
    err.status = 403;
    return next(err);
  }

  let addImage = await theSpot.createSpotImage(req.body);
  addImage = addImage.toJSON();
  delete addImage.createdAt;
  delete addImage.updatedAt;
  delete addImage.spotId;

  res.json(addImage);
});

router.get('/:spotId', async (req, res, next) => {
  const { spotId } = req.params;
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

  let owner = await theSpot.getOwner();
  let reviews = await Review.findAll({ where: { spotId: spotId, userId: owner.id } });
  let spotImages = await theSpot.getSpotImages();

  theSpot = theSpot.toJSON();
  theSpot.numReviews = reviews.length;
  if (theSpot.numReviews === 0) theSpot.avgStarRating = 0;
  else theSpot.avgStarRating = reviews.reduce((acc, review) => { return acc += review.stars }, 0) / reviews.length;
  theSpot.SpotImages = spotImages;

  res.json(theSpot);
});

router.get('/', async (req, res, next) => {
  let allSpots = await Spot.findAll({
    include: [
      {
        model: SpotImage,
        attributes: ['url']
      }
    ]
  });

  let daSpots = [];

  for(let i = 0; i < allSpots.length; i++){
    let currSpot = allSpots[i].toJSON();

    let count = await Review.count({where: {spotId: currSpot.id}});
    let totalStars = await Review.sum('stars', {where: {spotId: currSpot.id}});

    if(!count) currSpot.avgRating = null;
    else currSpot.avgRating = totalStars/count;

    if(!currSpot.SpotImages.length) currSpot.previewImage = null;
    if(currSpot.SpotImages.length) currSpot.previewImage = currSpot.SpotImages[0].url
    delete currSpot.SpotImages;

    daSpots.push(currSpot);
  }

  res.json({ Spots: daSpots });
});

module.exports = router;
