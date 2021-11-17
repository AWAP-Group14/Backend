const client = require('../database');

const order = {
    getById: function(id, callback) {
        return client.query('Select * from order where id=$1', [id], callback);    
    },

    getAll: function(callback) {
        return client.query('Select * from order', callback);
    },

    insertorder: function(orderId, body, callback) {
        const values = [orderId, body.order_comment, body.item_id, body.customer_id, body.order_status, body.delivery_type]
        return client.query("INSERT INTO order VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", values, callback)
    }

}
module.exports = order