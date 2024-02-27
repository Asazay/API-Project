const express = require('express');
const { Op } = require('sequelize');
const { requireAuth, checkAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const checkAuthorization = [requireAuth, handleValidationErrors];

const router = express.Router();

router.get('/current', checkAuthorization, async (req, res, next) => {
  const allReviews = await Review.findAll({
    where: {
      userId: req.user.id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
        include: {
          model: Spot,
        },
      },
      {
        model: ReviewImage
      }
    ]
  });

  res.json(allReviews)


})

module.exports = router;
