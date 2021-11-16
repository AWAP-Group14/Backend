const client = require('../database');

const customer = {
    getById: function(id, callback) {
        return client.query('Select customer_first_name, customer_last_name from customer where id=$1', [id], callback);
        
    },
    getAll: function(callback) {
        return client.query('Select * from customer', callback);
    },
    insertCustomer: function(userId, body, hashedPassword, callback) {
        return client.query("INSERT INTO customer VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", 
        [userId, body.firstname, body.lastname, body.address, body.phone, body.email, hashedPassword], callback)
    }

}
module.exports = customer