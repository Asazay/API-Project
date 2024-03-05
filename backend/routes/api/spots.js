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
  check('page').optional({checkFalsy: true}).custom(async page => {
    page = Number(page);
    if(isNaN(page)) throw new Error()
    if(page < 1) throw new Error();
  }).withMessage("Page must be greater than or equal to 1"),
  check('size').optional({checkFalsy: true}).custom(async size => {
    size = Number(size);
    if(isNaN(size)) throw new Error()
    if(size < 1) throw new Error();
  }).withMessage("Size must be greater than or equal to 1"),
  check('maxLat').optional({checkFalsy: true}).isDecimal().withMessage('Maximum latitude is invalid'),
  check('minLat').optional({checkFalsy: true}).isDecimal().withMessage('Minimum latitude is invalid'),
  check('maxLng').optional({checkFalsy: true}).isDecimal().withMessage('Maximum longitude is invalid'),
  check('minLng').optional({checkFalsy: true}).isDecimal().withMessage('Minimum longitude is invalid'),
  check('minPrice').optional({checkFalsy: true}).isFloat({min: 0}).withMessage('Minimum price must be greater than or equal to 0'),
  check('maxPrice').optional({checkFalsy: true}).isFloat({min: 0}).withMessage('Maximum price must be greater than or equal to 0'),
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
    return res.status(404).send({
      message: "Spot couldn't be found"
    })
  }

  if (!checkAuth(currUserId, theSpot.ownerId)) {
    return res.status(403).send({
      message: "Forbidden"
    });
  }

  const editSpot = await theSpot.update(req.body);

  res.json(editSpot)
});

router.post('/:spotId/images', checkAuthorization, async (req, res, next) => {
  const { spotId } = req.params;
  const currUserId = req.user.id;

  let theSpot = await Spot.findByPk(spotId);

  if (!theSpot) {
    return res.status(404).send({
      message: "Spot couldn't be found"
    })
  }

  const isAuthorized = checkAuth(currUserId, theSpot.ownerId);

  if (!isAuthorized) {
    return res.status(403).send({
      message: "Forbidden"
    });
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
    return res.status(404).send({
      message: "Spot couldn't be found"
    })
  }

  let owner = await theSpot.getOwner();
  let reviews = await Review.findAll({ where: { spotId: spotId, userId: owner.id } });
  let spotImages = await theSpot.getSpotImages();

  theSpot = theSpot.toJSON();
  theSpot.numReviews = reviews.length;
  if (theSpot.numReviews === 0) theSpot.avgStarRating = 0;
  else theSpot.avgStarRating = reviews.reduce((acc, review) => { return acc += review.stars }, 0) / reviews.length;
  theSpot.SpotImages = spotImages;
  theSpot.Owner = {
    id: owner.id,
    firstName: owner.firstName,
    lastName: owner.lastName
  }
  res.json(theSpot);
});

router.delete('/:spotId', checkAuthorization, async (req, res, next) => {
  const { spotId } = req.params;

  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).send({
      message: "Spot couldn't be found"
    })
  }

  let owner = await spot.getOwner();

  if (!checkAuth(req.user.id, owner.id)) {
    return res.status(403).send({
      message: "Forbidden"
    });
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
    return res.status(404).send({
      message: "Spot couldn't be found"
    })
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

  res.json({Reviews: allReviewsById});
});

router.get('/:spotId/bookings', checkAuthorization, async (req, res, next) => {
  const { spotId } = req.params;

  const theSpot = await Spot.findByPk(spotId);

  if (!theSpot) {
    return res.status(404).send({
      message: "Spot couldn't be found"
    })
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

    res.json({Bookings: theBookings})
  }

  else {
    theBookings = await Booking.findAll({
      where: {
        spotId: theSpot.id
      },
      attributes: ['spotId', 'startDate', 'endDate']
    });

    res.json({Bookings: theBookings});
  }
});

router.post('/:spotId/bookings', validateSpotBooking, async (req, res, next) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const user = req.user.id;

  const theSpot = await Spot.findByPk(spotId);

  if (!theSpot) {
    return res.status(404).send({
      message: "Spot couldn't be found"
    })
  }

  if (checkAuth(user, theSpot.ownerId)) {
    return res.status(403).send({
      message: "Forbidden"
    });
  }

  let spotBookings = await theSpot.getBookings();

  let error = new Error("Sorry, this spot is already booked for the specified dates");
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
    return res.status(403).send({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: error.errors
    });
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
    return res.status(404).send({
      message: "Spot couldn't be found"
    })
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
  else if(maxPrice) where.price = {[Op.lte]: Number(maxPrice)};
console.log(where)
  let allSpots = await Spot.findAll({
    where,
    offset: size * (page - 1),
    limit: size,
    include: [
      {
        model: SpotImage,
        attributes: ['url']
      }
    ],
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

  res.json({ Spots: daSpots, page: page, size: size});
});

module.exports = router;
