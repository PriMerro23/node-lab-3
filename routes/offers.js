const express = require('express');
const {
    getOffersByLotId,
    getSingleOffer,
    createSingleOffer,
} = require('../controllers/offers');

const router = express.Router();

router.post('/', createSingleOffer);
router.get('/:lotId', getSingleOffer);

module.exports = router;
