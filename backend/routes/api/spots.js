const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { requireAuth, checkAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, Sequelize } = require('../../db/models');
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

const validateReview = [
  requireAuth,
  check('review').exists({ checkFalsy: true }).notEmpty()
    .withMessage("Review text is required"),
  check('stars').exists({ checkFalsy: true })
    .withMessage("Stars must be an integer from 1 to 5"),
  check('stars').isInt({
    min: 1,
    max: 5
  }).withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

const allSpotsQueryVal = [
  check('page').custom(page => {
    if(typeof page !== 'number') throw new Error();
    if(page < 1) throw new Error();
  }).withMessage("Page must be greater than or equal to 1"),
  check('size').custom(size => {
    if(typeof size !== 'number') throw new Error();
    if(size < 1) throw new Error();
  }).withMessage("Size must be greater than or equal to 1"),
  check('maxLat').optional({ values: null }).isDecimal().withMessage('Maximum latitude is invalid'),
  check('minLat').optional({ values: null }).isDecimal().withMessage('Minimum latitude is invalid'),
  check('maxLng').optional({ values: null }).isDecimal().withMessage('Maximum longitude is invalid'),
  check('minLng').optional({ values: null }).isDecimal().withMessage('Minimum longitude is invalid'),
  check('minPrice').optional({ values: null }).isDecimal({
    min: 0
  }).withMessage('Maximum longitude is invalid'),
  check('maxPrice').optional({ values: null }).isFloat({
    min: 0
  }).withMessage('Maximum longitude is invalid'),
  handleValidationErrors
];

const date = new Date();
const theDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`


const validateSpotBooking = [
  requireAuth,
  check('startDate').exists({ checkFalsy: true }).notEmpty()
    .withMessage("Start date required"),
  check('endDate').exists({ checkFalsy: true }).notEmpty()
    .withMessage("endDate is required"),
  check('startDate').custom(async (startDate) => {
    if (new Date(startDate) < new Date(theDate)) throw new Error()
  }).withMessage("startDate cannot be in the past"),
  check('endDate').custom(async (value, { req }) => {
    if (new Date(value) <= new Date(req.body.startDate)) throw new Error()
  }).withMessage("endDate cannot be on or before startDate"),
  handleValidationErrors
]

const checkAuthorization = [requireAuth, handleValidationErrors];

const router = express.Router();

router.post('/', validateSpot, async (req, res, next) => {
  const spotOwner = await User.findByPk(req.user.id);
  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  const newSpot = await spotOwner.createSpot(req.body);

  if (newSpot) {
    res.status = 201;
    res.json(newSpot);
  }
});

router.get('/current', checkAuthorization, async (req, res, next) => {
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

  for (let i = 0; i < allSpots.length; i++) {
    let currSpot = allSpots[i].toJSON();

    let count = await Review.count({ where: { spotId: currSpot.id } });
    let totalStars = await Review.sum('stars', { where: { spotId: currSpot.id } });

    if (!count) currSpot.avgRating = null;
    else currSpot.avgRating = totalStars / count;

    if (!currSpot.SpotImages.length) currSpot.previewImage = null;
    if (currSpot.SpotImages.length) currSpot.previewImage = currSpot.SpotImages[0].url
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
    const err = new Error('Forbidden');
    err.title = 'Authorization required';
    err.errors = { message: 'Forbidden' };
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
    const err = new Error('Forbideen');
    err.title = 'Authorization required';
    err.errors = { message: 'Forbidden' };
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

router.delete('/:spotId', checkAuthorization, async (req, res, next) => {
  const { spotId } = req.params;

  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.title = "Spot not found";
    err.status = 404;
    err.message = "Spot couldn't be found";
    return next(err);
  }

  let owner = await spot.getOwner();

  if (!checkAuth(req.user.id, owner.id)) {
    const err = new Error('Forbidden');
    err.title = 'Authorization required';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
  }

  await spot.destroy();

  res.json({
    message: "Successfully deleted"
  })
});

router.get('/:spotId/reviews', async (req, res, next) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.title = "Spot not found";
    err.message = "Spot couldn't be found";
    return next(err);
  }

  let allReviewsById = await Review.findAll({
    where: {
      spotId: spotId
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  });

  res.json(allReviewsById);
});

router.get('/:spotId/bookings', checkAuthorization, async (req, res, next) => {
  const { spotId } = req.params;

  const theSpot = await Spot.findByPk(spotId);

  if (!theSpot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.title = "Spot not found";
    err.message = "Spot couldn't be found";
    return next(err);
  }

  const theOwner = await theSpot.getOwner();

  let theBookings;

  if (req.user.id === theOwner.id) {
    theBookings = await Booking.findAll({
      where: {
        spotId: theSpot.id
      },
      include: {
        model: User
      }
    });

    res.json(theBookings)
  }

  else {
    theBookings = await Booking.findAll({
      where: {
        spotId: theSpot.id
      }
    });

    res.json(theBookings);
  }
});

router.post('/:spotId/bookings', validateSpotBooking, async (req, res, next) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const user = req.user.id;

  const theSpot = await Spot.findByPk(spotId);

  if (!theSpot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.title = "Spot not found";
    err.message = "Spot couldn't be found";
    return next(err);
  }

  if (checkAuth(user, theSpot.ownerId)) {
    const err = new Error('Forbidden');
    err.title = 'Spot cannout belong to user';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
  }

  let spotBookings = await theSpot.getBookings();

  let error = new Error("Sorry, this spot is already booked for the specified dates");
  error.title = "Date(s) conflict with an existing booking";
  error.status = 403;
  error.errors = {};

  for (let i = 0; i < spotBookings.length; i++) {
    let booking = spotBookings[i].toJSON();

    let bookingStartDate = new Date(booking.startDate);
    bookingStartDate = Date.parse(bookingStartDate);

    let bookingEndDate = new Date(booking.endDate);
    bookingEndDate = Date.parse(bookingEndDate);

    let requestedStartDate = new Date(startDate);
    requestedStartDate = Date.parse(requestedStartDate);

    let requestedEndDate = new Date(endDate);
    requestedEndDate = Date.parse(requestedStartDate);

    if (requestedStartDate >= bookingStartDate && requestedStartDate <= bookingEndDate
      || bookingStartDate >= requestedStartDate && bookingStartDate <= requestedEndDate) {
      error.errors.startDate = "Start date conflicts with an existing booking";
      break;
    }
  }

  for (let i = 0; i < spotBookings.length; i++) {
    let booking = spotBookings[i].toJSON();

    let bookingStartDate = new Date(booking.startDate);
    bookingStartDate = Date.parse(bookingStartDate);

    let bookingEndDate = new Date(booking.endDate);
    bookingEndDate = Date.parse(bookingEndDate);

    let requestedStartDate = new Date(startDate);
    requestedStartDate = Date.parse(requestedStartDate);

    let requestedEndDate = new Date(endDate);
    requestedEndDate = Date.parse(requestedEndDate);

    if (requestedEndDate >= bookingStartDate && requestedEndDate <= bookingEndDate
      || bookingStartDate >= requestedStartDate && bookingStartDate <= requestedEndDate) {
      error.errors.endDate = "End date conflicts with an existing booking";
      break;
    }
  }

  if (error.errors.startDate || error.errors.endDate) {
    return next(error);
  }

  const newBooking = await theSpot.createBooking({
    userId: user,
    startDate,
    endDate,
  });

  res.json(newBooking);
});

router.post('/:spotId/reviews', validateReview, async (req, res, next) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.title = "Spot not found";
    err.message = "Spot couldn't be found";
    return next(err);
  }

  const reviewExist = await Review.findOne({
    where: {
      spotId: spotId,
      userId: req.user.id
    }
  });

  if (reviewExist) {
    res.status(403)
    return res.json({
      message: "User already has a review for this spot"
    });
  }

  let createReview = await Review.create({
    userId: req.user.id,
    spotId: spot.id,
    review: review,
    stars: stars
  })

  res.json(createReview)
})

router.get('/', allSpotsQueryVal, async (req, res, next) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  let where = {};

  if(!page) page = 1;
  if(!size) size = 20;

  if(minLat && maxLat) where.lat = {[Op.between]: [Number(minLat), Number(maxLat)]}
  else if(minLat) where.lat = {[Op.gte]: Number(minLat)};
  else if(maxLat) where.lat = {[Op.lte]: Number(maxLat)};

  if(minLng && maxLng) where.lng = {[Op.between]: [Number(minLng), Number(maxLng)]}
  else if(minLng) where.lng = {[Op.gte]: Number(minLng)};
  else if(maxLng) where.lng = {[Op.lte]: Number(maxLng)};

  if(minPrice && maxPrice) where.price = {[Op.between]: [Number(minPrice), Number(maxPrice)]};
  else if(minPrice) where.price = {[Op.gte]: Number(minPrice)}
  else if(maxPrice) where.maxPrice = {[Op.lte]: Number(maxPrice)};

  let allSpots = await Spot.findAll({
    where,
    offset: size * (page - 1),
    limit: size,
    include: [
      {
        model: SpotImage,
        attributes: ['url']
      }
    ]
  });

  let daSpots = [];

  for (let i = 0; i < allSpots.length; i++) {
    let currSpot = allSpots[i].toJSON();

    let count = await Review.count({ where: { spotId: currSpot.id } });
    let totalStars = await Review.sum('stars', { where: { spotId: currSpot.id } });

    if (!count) currSpot.avgRating = null;
    else currSpot.avgRating = totalStars / count;

    if (!currSpot.SpotImages.length) currSpot.previewImage = null;
    if (currSpot.SpotImages.length) currSpot.previewImage = currSpot.SpotImages[0].url
    delete currSpot.SpotImages;

    daSpots.push(currSpot);
  }

  res.json({ Spots: daSpots });
});

module.exports = router;
