const { pool } = require('./config');
const options = {capSQL: true};
const pgp = require('pg-promise')(options);
const bcrypt = require('bcryptjs');
const createError = require('http-errors')

let saltRound = 10;

module.exports = class User {

    async addUser(username, password, email, ip, stripe_id) {
        try {
            const hashedPassword = await bcrypt.hash(password, saltRound)
            const result = await pool.query('INSERT INTO users(username, password, email, ip, stripe_id) VALUES($1,$2,$3,$4,$5) RETURNING id, username, email, ip, role, stripe_id', [username, hashedPassword, email, ip, stripe_id]);
            return result.rows[0];
        } catch (error) {
            throw createError(401, error);
        }
    }

    async getUserByName(username) {
        try {
            const result = await pool.query('SELECT id, username, password, email, ip, role FROM users WHERE username=$1', [username]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const result = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const result = await pool.query('SELECT * FROM users');
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id,params) {
        try {
            const statement = pgp.helpers.update(params, null, 'users') + ` WHERE id=${id} RETURNING *`; 
            const result = await pool.query(statement);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const result = await pool.query('DELETE FROM users WHERE id=$1', [id]);
            return true;
        } catch (error) {
            throw error;
        }
    }

}