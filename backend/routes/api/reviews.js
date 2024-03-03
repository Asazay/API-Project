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

  res.json({Reviews: allReviews})
});

router.post('/:reviewId/images', checkAuthorization, async (req, res, next) => {
  const {reviewId} = req.params;
  const {url} = req.body;

  let review = await Review.findByPk(reviewId);

  if(!review){
    return res.status(404).send({
      message: "Review couldn't be found"
    });
  }

  const reviewImages = await review.getReviewImages();

  if(reviewImages.length >= 10){
    return res.status(403).send({
      message: "Forbidden"
    });
  }

  if(!checkAuth(req.user.id, review.userId)){
    return res.status(403).send({
      message: "Forbidden"
    });
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
    return res.status(404).send({
      message: "Review couldn't be found"
    });
  }

  if(!checkAuth(req.user.id, theReview.userId)){
    return res.status(403).send({
      message: "Forbidden"
    });
  }

  let updatedReview = await theReview.update(req.body)

  res.json(updatedReview);
});

router.delete('/:reviewId', checkAuthorization, async (req, res, next) => {
  const {reviewId} = req.params;

  const review = await Review.findByPk(reviewId);

  if(!review){
    return res.status(404).send({
      message: "Review couldn't be found"
    });
  }

  if(!checkAuth(req.user.id, review.userId)){
    return res.status(403).send({
      message: "Forbidden"
    });
  }

  await review.destroy();

  res.json({
    message: "Successfully deleted"
  });
});

module.exports = router;
