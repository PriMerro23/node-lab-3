const express = require('express');
const { getSingleUserHandler } = require('../controllers/users');
const {
    signUpHandler,
    signInHandler,
    logOutHandler,
} = require('../controllers/auth');

const router = express.Router();

router.get('/signIn', signInHandler);
router.get('/signUp', signUpHandler);
router.get('/logout', logOutHandler);
router.get('/:userId', getSingleUserHandler);

module.exports = router;
