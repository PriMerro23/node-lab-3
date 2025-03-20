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
            res.status(500).json({ error: 'Помилка сервера' });
        }
    }

    async getSingleOffer(req, res) {
        try {
            const offerId = parseInt(req.params.offerId);

            if (isNaN(offerId)) {
                return res.status(400).json({ error: 'Недійсний ідентифікатор пропозиції' });
            }

            const offer = await db.query(`SELECT * FROM offers WHERE id = $1`, [
                offerId,
            ]);

            if (offer.rows.length === 0) {
                return res.status(404).json({ error: 'Пропозицію не знайдено' });
            }

            res.json(offer.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Помилка сервера' });
        }
    }

    async createSingleOffer(req, res) {
        try {
            const { lotId, offerPrice } = req.body;
            const userId = req.session.userId; // Отримуємо user_id із сесії
    
            if (!userId) {
                return res.status(401).json({ error: "Користувача не авторизовано" });
            }
    
            // Отримуємо поточну максимальну ставку
            const lotResult = await db.query(`SELECT current_price FROM lots WHERE id = $1`, [lotId]);
    
            if (lotResult.rows.length === 0) {
                return res.status(404).json({ error: "Лот не знайдено" });
            }
    
            const currentPrice = lotResult.rows[0].current_price;
    
            if (offerPrice <= currentPrice) {
                return res.status(400).json({ error: "Ставка має бути більшою за поточну ціну" });
            }
    
            // Додаємо ставку в таблицю offers
            const newOfferResult = await db.query(
                `INSERT INTO offers (lot_id, user_id, offer_price) 
                 VALUES ($1, $2, $3) RETURNING *`,
                [lotId, userId, offerPrice]
            );
    
            // Оновлюємо поточну ціну лота
            await db.query(`UPDATE lots SET current_price = $1 WHERE id = $2`, [offerPrice, lotId]);
    
            // Отримуємо загальну кількість ставок
            const bidCountResult = await db.query(`SELECT COUNT(*) FROM offers WHERE lot_id = $1`, [lotId]);
    
            res.status(201).json({
                newMaxPrice: offerPrice,
                totalBids: bidCountResult.rows[0].count,
                newOffer: newOfferResult.rows[0]
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Помилка сервера" });
        }
    }
    
    
    async showCreateOfferForm(req, res) {
        const lotId = req.query.lotId;
        res.render('createOffer', { lotId });
    }
}

module.exports = new OffersController();
