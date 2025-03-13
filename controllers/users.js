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

            // Після успішної реєстрації встановлюємо сесію та переходимо на профіль
            req.session.userId = newUser.rows[0].id;
            res.redirect('/users/profile');
        } catch (error) {
            console.error(error);
            res.render('auth/signUp', { error: 'Помилка при реєстрації. Спробуйте ще раз.' });
        }
    }

    async signInHandler(req, res) {
        try {
            const { fname, password } = req.body;

            // Пошук користувача в БД
            const userResult = await db.query(
                `SELECT * FROM users WHERE fname = $1`,
                [fname]
            );

            if (userResult.rows.length === 0) {
                return res.render('auth/signIn', {
                    error: 'Невірний логін або пароль'
                });
            }

            const user = userResult.rows[0];

            // Перевірка пароля
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.render('auth/signIn', {
                    error: 'Невірний логін або пароль'
                });
            }

            // Встановлення сесії
            req.session.userId = user.id;
            res.redirect('/users/profile');
        } catch (error) {
            console.error(error);
            res.render('auth/signIn', {
                error: 'Помилка сервера'
            });
        }
    }

    async getUserProfile(req, res) {
        try {
            // Перевірка авторизації
            if (!req.session || !req.session.userId) {
                return res.redirect('/users/signIn');
            }

            // Отримання ID авторизованого користувача
            const userId = req.session.userId;

            // Завантаження даних користувача
            const userResult = await db.query(
                `SELECT id, fname, sname FROM users WHERE id = $1`,
                [userId]
            );

            if (userResult.rows.length === 0) {
                // Видаляємо недійсну сесію
                req.session.destroy();
                return res.redirect('/users/signIn');
            }

            // Завантаження лотів користувача
            const lotsResult = await db.query(
                `SELECT * FROM lots WHERE user_id = $1 ORDER BY start_time DESC`,
                [userId]
            );

            // Рендеринг шаблону з даними
            res.render('userProfile', {
                user: userResult.rows[0],
                lots: lotsResult.rows,
                error: null
            });
        } catch (error) {
            console.error(error);
            res.render('userProfile', {
                error: 'Помилка сервера',
                user: null,
                lots: []
            });
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
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Помилка сервера');
            }

            res.clearCookie('connect.sid');

            res.setHeader('Cache-Control', 'no-store');

            res.redirect('/users/signIn');
        });
    }
}

module.exports = new UserController();