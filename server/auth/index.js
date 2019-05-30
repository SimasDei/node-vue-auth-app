const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({
    msg: 'Route Operational o/ 🚗',
  });
});

module.exports = router;
