const express = require('express');
const lotsController = require('../controllers/lots');

const router = express.Router();

router.get('/', lotsController.getLots);
router.get('/user/:userId', lotsController.getLotsByUserId);
router.get('/:lotId', lotsController.getSingleLot);
router.post('/create', lotsController.createSingleLot);
router.post('/search', lotsController.searchLotByTitle);
router.delete('/:lotId', lotsController.deleteSingleLot);

module.exports = router;
