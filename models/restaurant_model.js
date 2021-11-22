const client = require('../database');

const restaurant = {
    getByNameAndEmail: function(name, email, callback) {
        return client.query('Select * from restaurant where restaurant_name=$1 or restaurant_email=$2', [name, email], callback);    
    },

    getAll: function(callback) {
        return client.query('Select * from restaurant', callback);
    },
    
    getAllFilteredByPrice: function(price, callback) {
        return client.query('Select * from restaurant where restaurant_price_level=$1', [price], callback);
    },

    getAllFilteredByType: function(type, callback) {
        return client.query('Select * from restaurant where restaurant_type=$1', [type], callback);
    },

    getAllFilteredByPriceAndType: function(price, type, callback) {
        return client.query('Select * from restaurant where restaurant_price_level=$1 and restaurant_type=$2', [price, type], callback);
    },

    getFeatured: function(callback) {
        return client.query('Select * from restaurant', callback);
    },

    insertRestaurant: function(body, hashedPassword, callback) {
        const values = [body.restaurantName, body.address, body.openingHour, body.image, body.email, hashedPassword, body.restaurantType, body.priceRange]
        return client.query("INSERT INTO restaurant VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", values, callback)
    }

}
module.exports = restaurant