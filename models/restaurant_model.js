const client = require('../database');
const restaurantInfo = " restaurant_name, restaurant_address, restaurant_operating_hours, restaurant_image, restaurant_type, restaurant_price_level "
var query = ""

const restaurant = {

    getByNameAndEmail: function(name, email, callback) {
        query = 'Select' + restaurantInfo + 'from restaurant where restaurant_name=$1 or restaurant_email=$2'
        return client.query(query, [name, email], callback);    
    },

    getByName: function(name, callback) {
        query = `SELECT restaurant.restaurant_name, restaurant_address, restaurant_operating_hours, restaurant_image, restaurant_type, 
                restaurant_price_level, menu_name, item_id, item_name, item_description, item_image, menu_id, item_price
                FROM restaurant LEFT OUTER JOIN restaurant_menu 
                ON restaurant.restaurant_name = restaurant_menu.restaurant_name 
                AND restaurant.restaurant_name = $1 
                INNER JOIN restaurant_item on restaurant_menu.id = restaurant_item.menu_id`
        return client.query(query, [name], callback)
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

    insertRestaurant: function(body, hashedPassword, callback) {
        const values = [body.restaurantName, body.address, body.openingHour, body.image, body.email, hashedPassword, body.restaurantType, body.priceRange]
        return client.query("INSERT INTO restaurant VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", values, callback)
    },

    insertItem: function (id, body, callback) {
        query = `INSERT INTO restaurant_item 
                VALUES ($1, $2, $3, $4, (SELECT id FROM restaurant_menu WHERE menu_name = $5), $6)
                RETURNING *`
        const values = [id, body.item_name, body.item_description, body.item_image, body.menu_name, body.item_price]
        return client.query(query, values, callback)
    },

    insertMenu: function (id, body, callback) {
        query =  `INSERT INTO restaurant_menu (id, menu_name, restaurant_name)
                VALUES ($1, $2, (SELECT restaurant_name FROM restaurant WHERE restaurant_name = $3))
                RETURNING *`
        const values = [id, body.menu_name, body.restaurant_name]
        return client.query(query, values, callback)
    },

    getMenu: function (restaurantName, callback) {
        return client.query("SELECT * FROM restaurant_menu WHERE restaurant_name = $1", [restaurantName], callback)
    }
}
module.exports = restaurant