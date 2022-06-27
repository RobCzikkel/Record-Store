const { pool } = require('../db/config');
const request = require('supertest');

//Closing DB connection after test for graceful exit
afterAll(async() => {
    await pool.end()
});

describe('DATABASE - connection', () => {
    test('it should return an array', async () => {
        const result = await pool.query('SELECT id FROM users')
        expect(result.rows).toBeInstanceOf(Array)
    })

    test('it should return an object', async () => {
        const result = await pool.query('SELECT id FROM users')
        expect(result.rows[0]).toBeInstanceOf(Object)
    })
});