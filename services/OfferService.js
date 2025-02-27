const { Offer, offers } = require('../models/offers');

class OfferService {
    static getOffersByLotId(lotId) {
        return offers.filter((offer) => offer.lotId === lotId);
    }

    static getOfferById(offerId) {
        return offers.find((offer) => offer.id === offerId);
    }

    static createOffer(lotId, userId, offerPrice) {
        if (!lotId || !userId || !offerPrice) {
            throw new Error('lotId, userId, and offerPrice are required');
        }

        const newOffer = new Offer(
            offers.length + 1,
            lotId,
            userId,
            offerPrice
        );

        offers.push(newOffer);
        return newOffer;
    }
}

module.exports = OfferService;
