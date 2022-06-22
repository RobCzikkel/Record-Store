const { pool } = require('../db/config');

describe('DATABASE - connection', () => {
    test('it should return an array', async () => {
        const result = await pool.query('SELECT * FROM users')
        expect(result.rows).toBeInstanceOf(Array)
    })
})
