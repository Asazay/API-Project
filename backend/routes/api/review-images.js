const express = require('express');
const { Op } = require('sequelize');
const { requireAuth, checkAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage, Booking} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const checkAuthorization = [requireAuth, handleValidationErrors];

const router = express.Router();

router.delete('/:imageId', checkAuthorization, async (req, res, next) => {
  const {imageId} = req.params;

  const revImage = await ReviewImage.findByPk(imageId);

  if(!revImage){
    const err = new Error("Review Image couldn't be found");
    err.title = "Review Image not found";
    err.status = 404;
    return next(err);
  }

  const review = await revImage.getReview();

  if(!checkAuth(req.user.id, review.userId)){
    const err = new Error('Forbidden');
    err.title = 'Authorization required';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
  }

  await revImage.destroy();

  res.json({
    message: "Successfully deleted"
  });
});

module.exports = router;
