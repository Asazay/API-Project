const express = require('express');
const { Op } = require('sequelize');
const { requireAuth, checkAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage, Booking} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const checkAuthorization = [requireAuth, handleValidationErrors];

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

const router = express.Router();

router.get('/current', checkAuthorization, async (req, res , next) => {
  const userBookings = await Booking.findAll({
    where: {
      userId: req.user.id
    },
    include: {
      model: Spot
    }
  });

  res.json(userBookings)
});

router.put('/:bookingId', validateSpotBooking, async (req, res, next) => {
  const {bookingId} = req.params;
  const {startDate, endDate} = req.body;
  const userId = req.user.id;

  const booking = await Booking.findByPk(bookingId);

  if(!booking){
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    err.title = "Booking not found";
    err.message = "Booking couldn't be found";
    return next(err);
  }

  if(!checkAuth(userId, booking.userId)){
    const err = new Error('Authorization required');
    err.title = 'Authorization required';
    err.message = 'Authorization required';
    err.status = 403;
    return next(err);
  }

  if(Date.parse(new Date()) > new Date(booking.endDate)){
    const err = new Error("Past booking's can't be modified");
    err.status = 403;
    err.title = "Booking can't be modified";
    err.message = "Past booking can't be modified";
    return next(err);
  }

  const theSpot = await Spot.findByPk(booking.spotId);

  let spotBookings = await theSpot.getBookings({
    where: {
      id: {
        [Op.not]: booking.id
      }
    }
  });

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

  const updateBooking = await booking.update({
    startDate,
    endDate
  });

  res.json(updateBooking);
})

module.exports = router;
