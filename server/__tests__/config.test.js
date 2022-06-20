const { pool } = require('../db/config');

describe('DATABASE - connection', () => {
    test('it should return something', async (done) => {
        const result = await pool.query('SELECT * FROM users')
        expect(result.rows).to.be.an(Array)
        done()
    })
})