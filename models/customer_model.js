const client = require('../database');

const customer = {
    getById: function(id, callback) {
        return client.query('Select customer_first_name, customer_last_name from customer where id=$1', [id], callback);    
    },

    getAll: function(callback) {
        return client.query('Select * from customer', callback);
    },

    getByEmail: function(email, callback) {
        return client.query('Select id, customer_email, customer_password from customer where customer_email=$1', [email], callback);
    },

    insertCustomer: function(customerId, body, hashedPassword, callback) {
        const values = [customerId, body.firstname, body.lastname, body.email, body.phone, body.address, hashedPassword]
        return client.query("INSERT INTO customer VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", values, callback)
    }

}
module.exports = customer