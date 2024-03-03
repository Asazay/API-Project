const express = require('express');
const { requireAuth, checkAuth } = require('../../utils/auth');
const {SpotImage, Spot, User} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const checkAuthorization = [requireAuth, handleValidationErrors];

const router = express.Router();

router.delete('/:imageId', checkAuthorization, async (req, res, next) => {
  const {imageId} = req.params;

  let image = await SpotImage.findByPk(imageId);

  if(!image) {
    let err = new Error();
    err.status = 404;
    return res.status(404).send({
      message: "Spot Image couldn't be found"
    });
  }

  let theSpot= await Spot.findOne({
    where: {
      id: image.spotId
    },
    attributes: ['id'],
    include: {
      model: User,
      as: 'Owner',
      attributes: ['id']
    }
  });

  theSpot = theSpot.toJSON()

  if (!checkAuth(req.user.id, theSpot.Owner.id)) {
    return res.status(403).send({
      message: "Forbidden"
    });
  }

  await image.destroy();

  res.json({
    message: 'Sucessfully deleted'
  })
})

module.exports = router;
