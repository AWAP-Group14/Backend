const client = require('../database');

const order = {
    getById: function(id, callback) {
        return client.query('Select * from "order" where id=$1', [id], callback);    
    },

    getByCustomerId: function(id, callback) {
        return client.query('Select * from "order" where customer_id=$1 and order_status=5', [id], callback);    
    },

    getActiveByCustomerId: function(id, callback) {
        return client.query('Select * from "order" where customer_id=$1 and order_status between 0 and 4', [id], callback);    
    },

    getActiveByRestaurantName: function(restaurantName, callback) {
        return client.query('Select * from "order" where upper(restaurant_name)=$1 and order_status between 0 and 4', [restaurantName], callback);    
    },

    getAll: function(callback) {
        return client.query('Select * from "order"', callback);
    },

    insertOrder: function(orderId, itemString, totalPrice, body, date, callback) {
        const values = [orderId, body.customer_id, body.order_status, body.delivery_type, itemString, body.delivery_address, body.order_comment, totalPrice, body.restaurant_name, date]
        return client.query('INSERT INTO "order" VALUES ($1, (SELECT id FROM customer WHERE id=$2), $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', values, callback)
    },

    updateOrder: function(id, body, callback) {
        query = `UPDATE "order"
                SET order_comment = $1, order_status = $2, 
                order_delivery_type = $3, delivery_address = $4
                WHERE id = $5
                RETURNING *`
        const values = [body.order_comment, body.order_status, body.delivery_type, body.delivery_address, id]
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