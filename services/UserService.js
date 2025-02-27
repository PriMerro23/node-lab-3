const { User, users } = require('../models/users');

class UserService {
    static registerUser(username, password) {
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        const existingUser = users.find((user) => user.username === username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const newUser = new User(users.length + 1, username, password);
        users.push(newUser);
        return newUser;
    }

    static authenticateUser(username, password) {
        return users.find(
            (user) => user.username === username && user.password === password
        );
    }

    static getUserById(userId) {
        return users.find((user) => user.id === userId);
    }
}

module.exports = UserService;
