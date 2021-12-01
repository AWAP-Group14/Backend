const client = require('../database');
const restaurantInfo = " restaurant_name, restaurant_address, restaurant_operating_hours, restaurant_image, restaurant_type, restaurant_price_level "
var query = ""

const restaurant = {

    getByNameAndEmail: function(name, email, callback) {
        query = 'Select' + restaurantInfo + 'from restaurant where restaurant_name=$1 or restaurant_email=$2'
        return client.query(query, [name, email], callback);    
    },

    getByEmail: function(email, callback) {
        return client.query('Select restaurant_email, restaurant_password from restaurant where restaurant_email=$1', [email], callback);
    },

    getByName: function(name, callback) {
        query = `SELECT restaurant.restaurant_name, restaurant_address, restaurant_operating_hours, restaurant_image, restaurant_type, 
                restaurant_price_level, menu_name, restaurant_item.id, item_name, item_description, item_image, menu_id, item_price
                FROM restaurant LEFT OUTER JOIN restaurant_menu 
                ON restaurant.restaurant_name = restaurant_menu.restaurant_name 
                AND UPPER(restaurant.restaurant_name) = $1 
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



    //Database connection to restaurant_item table
    getItem: function (id, callback) {
        return client.query("SELECT * FROM restaurant_item WHERE id = $1", [id], callback)
    },

    insertItem: function (id, body, callback) {
        query = `INSERT INTO restaurant_item 
                VALUES ($1, $2, $3, $4, (SELECT id FROM restaurant_menu WHERE UPPER(menu_name) = $5), $6)
                RETURNING *`
        const values = [id, body.item_name, body.item_description, body.item_image, body.menu_name.toUpperCase(), body.item_price]
        return client.query(query, values, callback)
    },

    updateItem: function (id, body, callback) {
        query = `UPDATE restaurant_item
                SET item_name = $1, item_description = $2, item_image = $3, item_price = $4
                WHERE id = $5
                RETURNING *`
        const values = [body.item_name, body.item_description, body.item_image, body.item_price, id]
        return client.query(query, values, callback)
    },

    deleteItem: function(id, callback) {
        return client.query("DELETE FROM restaurant_item WHERE id = $1", [id], callback)
    },



    //Database connection to restaurant_menu table
    getMenu: function (restaurantName, callback) {
        return client.query("SELECT * FROM restaurant_menu LEFT OUTER JOIN restaurant_item ON restaurant_menu.id = restaurant_item.menu_id WHERE UPPER(restaurant_name) = $1", [restaurantName.toUpperCase()], callback)
    },

    insertMenu: function (id, body, callback) {
        query = `INSERT INTO restaurant_menu (id, menu_name, restaurant_name)
                VALUES ($1, $2, (SELECT restaurant_name FROM restaurant WHERE UPPER(restaurant_name) = $3))
                RETURNING *`
        const values = [id, body.menu_name, body.restaurant_name.toUpperCase()]
        return client.query(query, values, callback)
    },

    updateMenu: function (id, body, callback) {
        query = `UPDATE restaurant_menu
                SET menu_name = $1, restaurant_name = $2
                WHERE id = $3
                RETURNING *`
        const values = [body.menu_name, body.restaurant_name, id]
        return client.query(query, values, callback)
    },

    deleteMenu: function (id, callback) {
        //ALTER TABLE restaurant_menu ON DELETE CASCADE
        return client.query("DELETE FROM restaurant_menu WHERE id= $1", [id], callback)
    }
}
module.exports = restaurant