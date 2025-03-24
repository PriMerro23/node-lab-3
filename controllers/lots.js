const db = require('../models/db');

class LotsController {
    async getLots(req, res, returnData = false) {
        try {
            const lots = await db.query(`SELECT * FROM lots`);
            if (returnData) return lots.rows;

            if (!res.headersSent) {
                res.json(lots.rows);
            }
        } catch (error) {
            console.error(error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Помилка сервера' });
            }
        }
    }

    async getLotsByUserId(req, res) {
        try {
            const userId = parseInt(req.params.userId);
            const lots = await db.query(
                `SELECT * FROM lots WHERE user_id = $1`,
                [userId]
            );
            res.json(lots.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Помилка сервера' });
        }
    }

    async updateLotStatus(req, res) {
        try {
            const lotId = parseInt(req.params.lotId);
            const { newStatus } = req.body;

            if (!req.session || !req.session.userId) {
                return res.status(401).json({ error: 'Необхідна авторизація' });
            }

            const userId = req.session.userId;

            const lot = await db.query(
                'SELECT user_id FROM lots WHERE id = $1',
                [lotId]
            );

            if (lot.rows.length === 0) {
                return res.status(404).json({ error: 'Лот не знайдено' });
            }

            if (lot.rows[0].user_id !== userId) {
                return res.status(403).json({ error: 'Недостатньо прав' });
            }

            await db.query('UPDATE lots SET status = $1 WHERE id = $2', [
                newStatus,
                lotId,
            ]);
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Помилка сервера' });
        }
    }

    async getSingleLot(req, res) {
        try {
            const lotId = parseInt(req.params.lotId);

            if (isNaN(lotId)) {
                return res
                    .status(400)
                    .json({ error: 'Недійсний ідентифікатор лоту' });
            }

            const lot = await db.query(`SELECT * FROM lots WHERE id = $1`, [
                lotId,
            ]);

            if (lot.rows.length === 0) {
                return res.status(404).send('Лот не знайдено');
            }

            const offerCount = await db.query(
                `SELECT COUNT(*) FROM offers WHERE lot_id = $1`,
                [lotId]
            );

            res.render('lot', {
                lot: lot.rows[0],
                offerCount: offerCount.rows[0].count,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Помилка сервера');
        }
    }

    async createSingleLot(req, res) {
        try {
            const {
                userId,
                title,
                description,
                startPrice,
                status,
                startTime,
                endTime,
                image,
            } = req.body;

            let userIdToUse = userId;

            if (req.session && req.session.userId) {
                userIdToUse = req.session.userId;
            }

            if (!title || !description || !startPrice || !userIdToUse) {
                return res.status(400).json({
                    error: "Не всі обов'язкові поля заповнені",
                });
            }

            const lotStatus = status === undefined ? true : Boolean(status);
            const newLot = await db.query(
                `INSERT INTO lots (user_id, title, description, start_price, current_price, status, start_time, end_time, image) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                [
                    userIdToUse,
                    title,
                    description,
                    startPrice,
                    startPrice,
                    status,
                    startTime,
                    endTime,
                    image,
                ]
            );

            res.status(201).json(newLot.rows[0]);
        } catch (error) {
            console.error('Error creating lot:', error);
            res.status(400).json({
                error: 'Помилка створення лоту',
                details: error.message,
            });
        }
    }

    async deleteSingleLot(req, res) {
        try {
            const lotId = parseInt(req.params.lotId);

            if (!req.session || !req.session.userId) {
                return res.status(401).json({ error: 'Необхідна авторизація' });
            }

            const userId = req.session.userId;

            const lot = await db.query(
                'SELECT user_id FROM lots WHERE id = $1',
                [lotId]
            );

            if (lot.rows.length === 0) {
                return res.status(404).json({ error: 'Лот не знайдено' });
            }

            if (lot.rows[0].user_id !== userId) {
                return res.status(403).json({ error: 'Недостатньо прав' });
            }

            await db.query('DELETE FROM offers WHERE lot_id = $1', [lotId]);

            const deletedLot = await db.query(
                'DELETE FROM lots WHERE id = $1 RETURNING *',
                [lotId]
            );

            if (deletedLot.rows.length === 0) {
                return res.status(404).json({ error: 'Лот не знайдено' });
            }

            res.status(200).json({
                message: 'Лот та всі офери видалено успішно',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Внутрішня помилка сервера' });
        }
    }

    async searchLotByTitle(req, res) {
        try {
            const { title } = req.body;

            if (!title) {
                return res
                    .status(400)
                    .json({ error: 'Title parameter is required' });
            }

            const foundLots = await db.query(
                `SELECT * FROM lots WHERE title ILIKE $1`,
                [`%${title}%`]
            );

            if (foundLots.rows.length === 0) {
                return res
                    .status(404)
                    .json({ error: 'No lots found with this title' });
            }

            res.json(foundLots.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new LotsController();
