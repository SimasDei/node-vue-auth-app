const express = require('express');
const Joi = require('joi');

const db = require('../db/conn');
const users = db.get('users');
users.createIndex('username', { unique: true });

const router = express.Router();

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_-]+$)/)
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .min(6)
    .max(20)
    .required(),
});

router.get('/', (req, res) => {
  res.json({
    msg: 'Route Operational o/ 🚗',
  });
});

router.post('/signup', (req, res) => {
  console.log('body', req.body);
  const result = Joi.validate(req.body, schema);
  res.json(result);
});

module.exports = router;
