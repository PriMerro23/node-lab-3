const express = require('express');
const {
    getLots,
    getLotsByUserId,
    getSingleLot,
    createSingleLot,
    deleteSingleLot,
    searchLotsByTitle,
} = require('../controllers/lots');

const router = express.Router();

router.post('/create', createSingleLot);
router.get('/search', searchLotsByTitle);
router.get('/:lotId', getSingleLot);
router.delete('/:lotId', deleteSingleLot);

module.exports = router;
