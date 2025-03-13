const db = require('../models/db');

class OffersController {
    async getOffersByLotId(req, res) {
        try {
            const lotId = parseInt(req.params.lotId);
            const offers = await db.query(
                `SELECT * FROM offers WHERE lot_id = $1`,
                [lotId]
            );
            res.json(offers.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getSingleOffer(req, res) {
        try {
            const offerId = parseInt(req.params.offerId);

            if (isNaN(offerId)) {
                return res.status(400).json({ error: 'Invalid offer ID' });
            }

            const offer = await db.query(`SELECT * FROM offers WHERE id = $1`, [
                offerId,
            ]);

            if (offer.rows.length === 0) {
                return res.status(404).json({ error: 'Offer not found' });
            }

            res.json(offer.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createSingleOffer(req, res) {
        try {
            const { lotId, userId, offerPrice } = req.body;

            const newOffer = await db.query(
                `INSERT INTO offers (lot_id, user_id, offer_price) 
                 VALUES ($1, $2, $3) RETURNING *`,
                [lotId, userId, offerPrice]
            );

            res.status(201).json(newOffer.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Error creating offer' });
        }
    }
    async showCreateOfferForm(req, res) {
        const lotId = req.query.lotId;
        res.render('createOffer', { lotId });
    }
}

module.exports = new OffersController();
