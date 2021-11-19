const client = require('../database');
const restaurantInfo = " restaurant_name, restaurant_address, restaurant_operating_hours, restaurant_image, restaurant_type, restaurant_price_level "
var query = ""

const restaurant = {
    getByName: function(name, callback) {
        query = 'Select' + restaurantInfo + 'from restaurant where restaurant_name=$1'
        return client.query(query, [name], callback);    
    },

    getAll: function(callback) {
        query = 'Select' + restaurantInfo + 'from restaurant'
        return client.query(query, callback);
    },
    
    getAllFilteredByPrice: function(price, callback) {
        query = 'Select' + restaurantInfo + 'from restaurant where restaurant_price_level=$1'
        return client.query(query, [price], callback);
    },

    getAllFilteredByType: function(type, callback) {
        query = 'Select' + restaurantInfo + 'from restaurant where restaurant_type=$1'
        return client.query(query, [type], callback);
    },

    getAllFilteredByPriceAndType: function(price, type, callback) {
        query = 'Select' + restaurantInfo + 'from restaurant where restaurant_price_level=$1 and restaurant_type=$2'
        return client.query('Select * from restaurant where restaurant_price_level=$1 and restaurant_type=$2', [price, type], callback);
    },

    getLimited: function(number, callback) {
        query = 'Select' + restaurantInfo + 'from restaurant limit ' + number
        return client.query(query, callback);
    },

    //Not yet implemented
    insertRestaurant: function(body, hashedPassword, callback) {
        const values = [userId, body.firstname, body.lastname, body.address, body.phone, body.email, hashedPassword]
        //return client.query("INSERT INTO customer VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", values, callback)
    }

}
module.exports = restaurant