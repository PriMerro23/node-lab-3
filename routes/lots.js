const express = require('express');
const {
    getLots,
    getLotsByUserId,
    getSingleLot,
    createSingleLot,
    deleteSingleLot,
    searchLotByTitle,
} = require('../controllers/lots');

const router = express.Router();

router.post('/create', createSingleLot);
router.post('/search', searchLotByTitle);
router.get('/:lotId', getSingleLot);
router.delete('/:lotId', deleteSingleLot);

module.exports = router;
