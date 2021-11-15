const client = require('../database');

const customer = {
    getById: function(id, callback) {
        return client.query('Select customer_first_name, customer_last_name from customer where id=$1', [id], callback);
        
    },
    getAll: function(callback) {
        return client.query('Select * from customer', callback);
    }
}
module.exports = customer