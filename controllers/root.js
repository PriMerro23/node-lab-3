const { Lot, lots } = require('../models/lots');

const sampleLots = [
    new Lot(
        1,
        'Old Vintage Car',
        'A classic car from the 1960s, restored to its original condition.',
        5000,
        5500,
        'active',
        '2025-02-01T10:00:00',
        '2025-02-20T18:00:00',
        1,
        '/images/1.jpg'
    ),
    new Lot(
        2,
        'Modern Art Painting',
        'An abstract painting by a renowned contemporary artist.',
        12000,
        12500,
        'active',
        '2025-02-05T12:00:00',
        '2025-02-25T20:00:00',
        2,
        '/images/2.webp'
    ),
    new Lot(
        3,
        'Gaming Laptop',
        'A high-performance laptop for gaming, featuring top specs.',
        1500,
        1600,
        'sold',
        '2025-01-10T08:00:00',
        '2025-01-20T12:00:00',
        3,
        '/images/3.jpg'
    ),
];

const getRootHandler = (req, res) => {
    res.render('index', { lots: sampleLots });
};

module.exports = { getRootHandler };
