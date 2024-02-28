const express = require('express');
const { Op } = require('sequelize');
const { requireAuth, checkAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage, Booking} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const checkAuthorization = [requireAuth, handleValidationErrors];

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
})

module.exports = router;
