const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const db = require('../db/conn');
db.then(() => console.log('Connected to the database')).catch(error => console.log(error));
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
    .trim()
    .min(6)
    .max(20)
    .required(),
});

router.get('/', (req, res) => {
  res.json({
    msg: 'Route Operational o/ 🚗',
  });
});

router.post('/signup', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  const { username, password } = req.body;
  // If no errors, check for user in DB
  if (result.error === null) {
    users
      .findOne({
        username,
      })
      .then(user => {
        // If no user found, hash the password, else, throw error
        if (user) {
          const error = new Error('User already exists');
          next(error);
        } else {
          bcrypt
            .hash(password, 12)
            .then(hashedPass => {
              // After pasword hashing, insert user to db
              const newUser = {
                username,
                password: hashedPass,
              };
              users.insert(newUser).then(user => {
                delete user.password;
                res.json(user);
              });
            })
            .catch(error => {
              next(error);
            });
        }
      });
  } else {
    next(result.error);
  }
});

module.exports = router;
