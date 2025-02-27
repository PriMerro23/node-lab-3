const LotService = require('../services/LotService');

const getLots = (req, res) => {
    res.json(LotService.getAllLots());
};

const getLotsByUserId = (req, res) => {
    const userId = parseInt(req.params.userId);
    res.json(LotService.getLotsByUserId(userId));
};

const getSingleLot = (req, res) => {
    const lotId = parseInt(req.params.id);
    const lot = LotService.getLotById(lotId);

    if (!lot) {
        return res.status(404).json({ error: 'Lot not found' });
    }

    res.json(lot);
};

const createSingleLot = (req, res) => {
    try {
        const { userId, title, description, startPrice, status } = req.body;
        const newLot = LotService.createLot(
            userId,
            title,
            description,
            startPrice,
            status
        );
        res.status(201).json(newLot);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteSingleLot = (req, res) => {
    try {
        const lotId = parseInt(req.params.id);
        const result = LotService.deleteLot(lotId);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const searchLotByTitle = (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title parameter is required' });
    }

    const foundLots = LotService.searchLotByTitle(title);

    if (typeof foundLots === 'string') {
        return res.status(400).json({ error: foundLots });
    }

    if (foundLots.length === 0) {
        return res.status(404).json({ error: 'No lots found with this title' });
    }

    res.json(foundLots);
};

module.exports = {
    getLots,
    getLotsByUserId,
    getSingleLot,
    createSingleLot,
    deleteSingleLot,
    searchLotByTitle,
};
