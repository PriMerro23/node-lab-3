const OfferService = require('../services/OfferService');

const getOffersByLotId = (req, res) => {
    const lotId = parseInt(req.params.lotId);
    res.json(OfferService.getOffersByLotId(lotId));
};

const getSingleOffer = (req, res) => {
    const offerId = parseInt(req.params.id);
    const offer = OfferService.getOfferById(offerId);

    if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
    }

    res.json(offer);
};

const createSingleOffer = (req, res) => {
    try {
        const { lotId, userId, offerPrice } = req.body;
        const newOffer = OfferService.createOffer(lotId, userId, offerPrice);
        res.status(201).json(newOffer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getOffersByLotId,
    getSingleOffer,
    createSingleOffer,
};
