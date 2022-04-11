const { pool } = require('./config');
const options = {capSQL: true};
const pgp = require('pg-promise')(options);


module.exports = class Tracks {

    async addTrack(params) {
        try {
            const statement = pgp.helpers.insert(params,null, 'tracks') + ' RETURNING *';
            const result = await pool.query(statement);
            return result.rows[0]
        } catch (error) {
            throw error;
        }
    };

    async updateTrack(id, params) {
        try {
            const statement = pgp.helpers.update(params,null, 'tracks') + ` WHERE id=${id} RETURNING *`;
            const result = await pool.query(statement);
            return result.rows[0]
        } catch (error) {
            throw error;
        }
    };

    async deleteTracksByAlbum(album_id) {
        try {
            const result = await pool.query('DELETE FROM tracks WHERE album_id=$1', [album_id]);
            return true
        } catch (error) {
            throw error;
        }
    };

    async deleteSingleTrack(id) {
        try {
            const result = await pool.query('DELETE FROM tracks WHERE id=$1', [id]);
            return true
        } catch (error) {
            throw error;
        }
    }

    async getTracksByAlbum(album_id) {
        try {
            const result = await pool.query('SELECT * FROM tracks WHERE album_id=$1', [album_id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    };

    async getSingleTrack(id) {
        try {
            const result = await pool.query('SELECT * FROM tracks WHERE id=$1', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}