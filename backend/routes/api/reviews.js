const express = require('express');
const { Op } = require('sequelize');
const { requireAuth, checkAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const checkAuthorization = [requireAuth, handleValidationErrors];

const checkEditReview = [
  check('review').exists({checkFalsy: true}).notEmpty()
  .withMessage("Review text is required"),
  check('stars').exists({checkFalsy: true}).isInt({
    min: 1,
    max: 5
  }).withMessage("Stars must be an integer from 1 to 5"),
  checkAuthorization
]

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
});

router.post('/:reviewId/images', checkAuthorization, async (req, res, next) => {
  const {reviewId} = req.params;
  const {url} = req.body;

  let review = await Review.findByPk(reviewId);

  if(!review){
    const err = new Error("Review couldn't be found");
    err.status = 404;
    err.title = "Couldn't find review";
    err.message = "Review couldn't be foud";
    return next(err);
  }

  const reviewImages = await review.getReviewImages();

  if(reviewImages.length >= 10){
    const err = new Error("Maximum number of images for this resource was reached");
    err.status = 403;
    err.title = "Maximum number of images reached";
    err.message = "Maximum number of images for this resource reached";
    return next(err);
  }

  if(!checkAuth(req.user.id, review.userId)){
    const err = new Error('Authorization required');
    err.title = 'Authorization required';
    err.errors = { message: 'Authorization required' };
    err.status = 403;
    res.status(403);
    return next(err);
  }

  const newRevImg = await ReviewImage.create({
    reviewId: review.id,
    url: url
  });

  res.json(newRevImg);
});

router.put('/:reviewId', checkEditReview, async (req, res, next) => {
  const {reviewId} = req.params;

  let theReview = await Review.findByPk(reviewId);

  if(!theReview){
    const err = new Error("Review couldn't be found");
    err.status = 404;
    err.title = "Couldn't find review";
    err.message = "Review couldn't be foud";
    return next(err);
  }

  if(!checkAuth(req.user.id, theReview.userId)){
    const err = new Error('Authorization required');
    err.title = 'Authorization required';
    err.errors = { message: 'Authorization required' };
    err.status = 403;
    res.status(403);
    return next(err);
  }

  let updatedReview = await theReview.update(req.body)

  res.json(updatedReview);
});

module.exports = router;
