const { Lot, lots } = require('../models/lots');

class LotService {
    static getAllLots() {
        return lots;
    }

    static getLotsByUserId(userId) {
        return lots.filter((lot) => lot.userId === userId);
    }

    static getLotById(lotId) {
        return lots.find((lot) => lot.id === lotId);
    }

    static createLot(userId, title, description, startPrice, status) {
        if (!userId || !title || !startPrice) {
            throw new Error('userId, title, and startPrice are required');
        }

        const newLot = new Lot(
            lots.length + 1,
            userId,
            title,
            description || '',
            startPrice,
            status || 'active',
            new Date()
        );

        lots.push(newLot);
        return newLot;
    }

    static deleteLot(lotId) {
        const lotIndex = lots.findIndex((lot) => lot.id === lotId);

        if (lotIndex === -1) {
            throw new Error('Lot not found');
        }

        lots.splice(lotIndex, 1);
        return { message: 'Lot deleted successfully' };
    }

    static searchLotsByTitle(title) {
        return lots.filter((lot) =>
            lot.title.toLowerCase().includes(title.toLowerCase())
        );
    }
}

module.exports = LotService;
