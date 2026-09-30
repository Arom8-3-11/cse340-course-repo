import bcrypt from 'bcrypt';
import db from './db.js';

const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
        RETURNING user_id
    `;
    const result = await db.query(query, [name, email, passwordHash, 'user']);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password_hash, role_id
        FROM users
        WHERE email = $1
    `;
    const result = await db.query(query, [email]);

    return result.rows[0] ?? null;
};

const verifyPassword = async (password, passwordHash) => bcrypt.compare(password, passwordHash);

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.password_hash))) {
        return null;
    }

    const { password_hash, ...authenticatedUser } = user;
    return authenticatedUser;
};

export { createUser, authenticateUser };