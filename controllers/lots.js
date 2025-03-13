const db = require('../models/db');

class LotsController {
    async getLots(req, res, returnData = false) {
        try {
            const lots = await db.query(`SELECT * FROM lots`);
            if (returnData) return lots.rows; // Тепер можна без проблем використовувати в render()

            if (!res.headersSent) {
                res.json(lots.rows); // Відправляємо відповідь лише один раз
            }
        } catch (error) {
            console.error(error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Internal server error' });
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
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateLotStatus(req, res) {
        try {
            const lotId = parseInt(req.params.lotId);
            const { newStatus } = req.body;

            // Перевірка авторизації
            if (!req.session || !req.session.userId) {
                return res.status(401).json({ error: 'Необхідна авторизація' });
            }

            const userId = req.session.userId;

            // Перевірка прав власника
            const lot = await db.query('SELECT user_id FROM lots WHERE id = $1', [lotId]);

            if (lot.rows.length === 0) {
                return res.status(404).json({ error: 'Лот не знайдено' });
            }

            if (lot.rows[0].user_id !== userId) {
                return res.status(403).json({ error: 'Недостатньо прав' });
            }

            // Оновлення статусу
            await db.query('UPDATE lots SET status = $1 WHERE id = $2', [newStatus, lotId]);
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
                return res.status(400).json({ error: 'Invalid lot ID' });
            }

            const lot = await db.query(`SELECT * FROM lots WHERE id = $1`, [
                lotId,
            ]);

            if (lot.rows.length === 0) {
                return res.status(404).json({ error: 'Lot not found' });
            }

            res.json(lot.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createSingleLot(req, res) {
        try {
            const { userId, title, description, startPrice, status } = req.body;

            // Перевірка авторизації для API
            let userIdToUse = userId;

            // Якщо запит через API і є сесія, використовуємо ID з сесії
            if (req.session && req.session.userId) {
                userIdToUse = req.session.userId;
            }

            // Перевірка обов'язкових полів
            if (!title || !description || !startPrice || !userIdToUse) {
                return res.status(400).json({
                    error: 'Не всі обов\'язкові поля заповнені'
                });
            }

            const startTime = new Date();
            const endTime = new Date();
            endTime.setDate(startTime.getDate() + 7); // Лот активний 7 днів

            const lotStatus = status === undefined ? true : Boolean(status);
            const newLot = await db.query(
                `INSERT INTO lots (user_id, title, description, start_price, current_price, status, start_time, end_time) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [
                    userIdToUse,
                    title,
                    description,
                    startPrice,
                    startPrice, // поточна ціна дорівнює початковій
                    status, // за замовчуванням активний
                    startTime,
                    endTime,
                ]
            );

            res.status(201).json(newLot.rows[0]);
        } catch (error) {
            console.error('Error creating lot:', error);
            res.status(400).json({
                error: 'Error creating lot',
                details: error.message,
            });
        }
    }

    async deleteSingleLot(req, res) {
        try {
            const lotId = parseInt(req.params.lotId);

            // Перевірка авторизації
            if (!req.session || !req.session.userId) {
                return res.status(401).json({ error: 'Необхідна авторизація' });
            }

            const userId = req.session.userId;

            // Перевірка прав власника
            const lot = await db.query('SELECT user_id FROM lots WHERE id = $1', [lotId]);

            if (lot.rows.length === 0) {
                return res.status(404).json({ error: 'Лот не знайдено' });
            }

            if (lot.rows[0].user_id !== userId) {
                return res.status(403).json({ error: 'Недостатньо прав' });
            }

            const deletedLot = await db.query(
                `DELETE FROM lots WHERE id = $1 RETURNING *`,
                [lotId]
            );

            if (deletedLot.rows.length === 0) {
                return res.status(404).json({ error: 'Lot not found' });
            }

            res.status(200).json({ message: 'Lot deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
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