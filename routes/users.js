const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

router.post('/', function (req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
