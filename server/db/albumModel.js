const { pool } = require('./config');
const options = {capSQL: true};
const pgp = require('pg-promise')(options);

module.exports = class Albums {

    async createAlbum(params) {
        try {
            const statement = pgp.helpers.insert(params, null, 'albums') + ' RETURNING *'
            const result = await pool.query(statement);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    };
    
    async deleteAlbum(id) {
        try {
            const result = await pool.query('DELETE FROM albums WHERE id=$1', [id]);
            return true;
        } catch (error) {
            throw error;
        }
    };

    async updateAlbum(id, params) {
        try {
            const statement = pgp.helpers.update(params, null, 'albums') + ` WHERE id=${id} RETURNING *`
            const result = await pool.query(statement);
            return result.rows[0]
        } catch (error) {
            throw error;
        }
    };

    async getAlbums() {
        try {
            const result = await pool.query('SELECT * FROM albums');
            return result.rows;
        } catch (error) {
            throw error;
        }
    };

    async getAlbumByID(id) {
        try {
            const result = await pool.query('SELECT * FROM albums WHERE id=$1', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }


}