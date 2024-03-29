// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const spotImagesRouter = require('./spot-images.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const reviewImagesRouter = require('./review-images.js');
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);
router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status).send({message: err.message})
})
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter)
router.use('/spot-images', spotImagesRouter);
router.use('/reviews', reviewsRouter);
router.use('/bookings', bookingsRouter);
router.use('/review-images', reviewImagesRouter);

router.post('/test', (req, res, next) => {
  res.json({
    requestBody: req.body
  });
});

module.exports = router;
