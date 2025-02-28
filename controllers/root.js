const LotsController = require('./lots');

const getRootHandler = async (req, res) => {
    try {
        const lots = await LotsController.getLots(req, res, true);

        res.render('index', { lots });
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = { getRootHandler };
