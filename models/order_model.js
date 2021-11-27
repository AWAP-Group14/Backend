const client = require('../database');

const order = {
    getById: function(id, callback) {
        return client.query('Select * from order where id=$1', [id], callback);    
    },

    getAll: function(callback) {
        return client.query('Select * from "order"', callback);
    },

    insertOrder: function(orderId, itemString,  body, callback) {
        const values = [orderId, body.order_comment, body.customer_id, body.order_status, body.delivery_type, itemString]
        return client.query('INSERT INTO "order" VALUES ($1, $2, (SELECT id FROM customer WHERE id=$3), $4, $5, $6) RETURNING *', values, callback)
    },

    updateOrder: function(id, body, callback) {
        query = `UPDATE "order"
                SET order_comment = $1, order_status = $2, order_delivery_type = $3
                WHERE id = $4
                RETURNING *`
        const values = [body.order_comment, body.order_status, body.delivery_type, id]
        return client.query(query, values, callback)
    },

    changeOrderStatus: function(id, status,  callback) {
        query = `UPDATE "order"
                SET order_status = $1
                WHERE id = $2
                RETURNING *`
        const values = [status, id]
        return client.query(query, values, callback)
    },
    
    deleteOrder: function(id, callback) {
        return client.query("DELETE FROM restaurant_menu WHERE id= $1", [id], callback)
    }

}
module.exports = order