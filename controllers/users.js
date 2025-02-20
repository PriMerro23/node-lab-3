const UserService = require('../services/UserService');

const getSingleUserHandler = (req, res) => {
    const userId = parseInt(req.params.id);
    const user = UserService.getUserById(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ id: user.id, username: user.username });
};

module.exports = { getSingleUserHandler };
