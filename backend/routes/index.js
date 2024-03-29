// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

router.use('/api', apiRouter);
// router.use((err, req, res, next) => {
//   res.status(err.status).send({message: err.message})
// })
router.get('/api/csrf/restore', async (req, res, next) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({
    'XRSF-Token': csrfToken
  });
});

module.exports = router;
