const db = require('../models/db');

class UserController {
    async signUpHandler(req, res) {
        try {
            const { fname, sname, password } = req.body;
            const newUser = await db.query(
                `INSERT INTO users (fname, sname, password) VALUES ($1, $2, $3) RETURNING *`,
                [fname, sname, password]
            );

            res.status(201).json(newUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async signInHandler(req, res) {
        try {
            const { fname, password } = req.body;

            const user = await UserService.authenticateUser(fname, password);
            if (!user) {
                return res
                    .status(401)
                    .json({ error: 'Invalid username or password' });
            }

            res.status(200).json({
                message: 'User logged in successfully',
                username: user.fname,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    logOutHandler(req, res) {
        res.status(200).json({ message: 'User logged out successfully' });
    }
}

module.exports = new UserController();
