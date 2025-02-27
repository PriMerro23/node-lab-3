const express = require('express');
const { getSingleUserHandler } = require('../controllers/users');
const {
    signUpHandler,
    signInHandler,
    logOutHandler,
} = require('../controllers/auth');

const router = express.Router();

router.post('/signIn', signInHandler);
router.post('/signUp', signUpHandler);
router.get('/logout', logOutHandler);
router.get('/profile', getSingleUserHandler);

module.exports = router;
