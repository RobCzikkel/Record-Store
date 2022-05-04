const pgp = require('pg-promise')({capSQL: true});
const { pool } = require('./config');

module.exports = class OrderItem {

    async addItem(params) {
        try {
            const statement = pgp.helpers.insert(params,null,'order_items') + ' RETURNING *';
            const result = await pool.query(statement);
            return result.rows[0]
        } catch (error) {
            throw(error)
        }
    }

    async getItems(id) {
        try {
            const result = await pool.query(`
            SELECT o.track_id, o.price, t.title, t.playtime, t.sample, a.artist, a.title, a.cover, a.catalogue
            FROM order_items o
            INNER JOIN tracks t ON t.id = o.track_id
            INNER JOIN albums a ON a.id = t.album_id
            WHERE order_id=$1`, [id]);
            return result.rows;
        } catch (error) {
            throw(error)
        }
    }

}