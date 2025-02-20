const UserService = require('../services/UserService');

const signUpHandler = (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = UserService.registerUser(username, password);
        res.status(201).json({
            message: 'User registered successfully',
            username: newUser.username,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signInHandler = (req, res) => {
    const { username, password } = req.body;
    const user = UserService.authenticateUser(username, password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'User logged in successfully', username });
};

const logOutHandler = (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
};

module.exports = { signUpHandler, signInHandler, logOutHandler };
