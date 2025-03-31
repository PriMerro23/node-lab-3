const LotsController = require('./lots');
const db = require('../models/db');

const getRootHandler = async (req, res) => {
    try {
        const searchQuery = req.query.q;
        let lots;

        if (searchQuery) {
            const searchResults = await db.query(
                `SELECT * FROM lots WHERE title ILIKE $1 OR description ILIKE $1`,
                [`%${searchQuery}%`]
            );
            lots = searchResults.rows;
        } else {
            lots = await LotsController.getLots(req, res, true);
        }

        const searchNotFound = req.query.search === 'notfound';

        res.render('index', {
            lots,
            searchQuery,
            searchNotFound
        });
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = { getRootHandler };