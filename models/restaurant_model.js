const client = require('../database');

const restaurant = {
    getByName: function(name, callback) {
        return client.query('Select * from restaurant where restaurant_name=$1', [name], callback);    
    },

    getAll: function(callback) {
        return client.query('Select * from restaurant', callback);
    },

    getFeatured: function(callback) {
        return client.query('Select * from restaurant', callback);
    },

    //Not yet implemented
    insertRestaurant: function(body, hashedPassword, callback) {
        const values = [userId, body.firstname, body.lastname, body.address, body.phone, body.email, hashedPassword]
        //return client.query("INSERT INTO customer VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", values, callback)
    }




}
module.exports = restaurant