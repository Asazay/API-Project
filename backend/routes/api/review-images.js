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
    return res.status(404).send({
      message: "Review Image couldn't be found"
    })
  }

  const review = await revImage.getReview();

  if(!checkAuth(req.user.id, review.userId)){
    return res.status(403).send({
      message: "Forbidden"
    });
  }

  await revImage.destroy();

  res.json({
    message: "Successfully deleted"
  });
});

module.exports = router;
