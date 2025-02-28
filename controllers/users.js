const db = require('../models/db');
const bcrypt = require('bcrypt');

class UserController {
    async signUpHandler(req, res) {
        try {
            const { fname, sname, password } = req.body;

            // Хешуємо пароль перед збереженням у БД
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await db.query(
                `INSERT INTO users (fname, sname, password) VALUES ($1, $2, $3) RETURNING id, fname, sname`,
                [fname, sname, hashedPassword]
            );

            res.status(201).json({
                message: 'User registered successfully',
                user: newUser.rows[0],
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async signInHandler(req, res) {
        try {
            const { fname, password } = req.body;

            const userResult = await db.query(
                `SELECT * FROM users WHERE fname = $1`,
                [fname]
            );
            if (userResult.rows.length === 0) {
                return res
                    .status(401)
                    .json({ error: 'Invalid username or password' });
            }

            const user = userResult.rows[0];

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                return res
                    .status(401)
                    .json({ error: 'Invalid username or password' });
            }

            res.status(200).json({
                message: 'User logged in successfully',
                user: { id: user.id, fname: user.fname, sname: user.sname },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getSingleUserHandler(req, res) {
        try {
            const userId = parseInt(req.params.userId);

            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }

            const userResult = await db.query(
                `SELECT id, fname, sname FROM users WHERE id = $1`,
                [userId]
            );

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(userResult.rows[0]);
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
