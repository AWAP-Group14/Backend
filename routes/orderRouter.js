let router = require('express').Router()
const { v4: uuidv4 } = require('uuid');
const order = require('../models/order_model')
const restaurant = require('../models/restaurant_model')
const Ajv = require('ajv')
const ajv = new Ajv()


//Initialize JSON Validator
const shoppingCartSchema = require('../schemas/shoppingCart.schema.json');
// const { shoppingCart } = require('../data');
const shoppingCartValidator = ajv.compile(shoppingCartSchema)


module.exports = function(passport, data) {

    /* router.post('/add', (req, res) => {
        
            let orderId = uuidv4()

            //This should push the data into the database
            console.log(req.body)
            console.log(data)
            data.orders.push({
                id: orderId,
                order_comment: req.body.order_comment,
                item_id: req.body.item_id,
                order_id: hashedPasswd,
                order_status: req.body.order_status,
                delivery_type: req.body.delivery_type
            })
            res.send(orderId)

            
    }) */

    router.get('/:id?',
        function(request, response) {
            if (request.params.id) {
                order.getById(request.params.id, function(err, dbResult) {
                    if (err) {
                        response.json(err);
                    } else {
                        response.json(dbResult.rows);
                    }
                });
            } else {
                order.getAll(function(err, dbResult) {
                    if (err) {
                        response.json(err);
                    } else {
                        response.json(dbResult.rows);
                    }
                });
            }
        }
    );

    router.post('/shoppingCart/:id', function (req, res) {
        
        const validationResult = shoppingCartValidator(req.body)
        if(validationResult) {
            
            //This should push the data into the database
            
            let index = data.shoppingCart.findIndex(cart => (cart.userId === req.params.id && cart.restaurantName === req.body.restaurantName))
            if (index != -1 ) {
                var itemExist = false
                data.shoppingCart[index].items.forEach(item => {
                    if((item.itemId == req.body.itemId) && (req.query.reduce != "1")) {
                        item.amount += req.body.amount
                        itemExist = true 
                    } else if (req.query.reduce == "1"){
                        item.amount -= req.body.amount
                        itemExist = true 
                    }
                })
                if(!itemExist) {
                    data.shoppingCart[index].items.push({
                        itemId: req.body.itemId,
                        amount: req.body.amount
                    })
                }
            } else {
                data.shoppingCart.push({
                    userId : req.params.id,
                    restaurantName : req.body.restaurantName,
                    items: [{
                        itemId: req.body.itemId, 
                        amount : req.body.amount 
                    }]
                })
            }
            res.status(200)
            res.send("Item succesfully added to the shopping cart")
            // console.log(data.shoppingCart[index])
        } else {
            res.sendStatus(400)
        }
    })

    router.get('/shoppingCart/:id', (req, res) => {
        let index = data.shoppingCart.findIndex(cart => cart.userId === req.params.id)
        var itemsArray = []
        var count = 0
        var totalPrice = 0
        if (index !== -1) {
            const requestedData = data.shoppingCart[index]
            requestedData.items.forEach(item => {
                restaurant.getItem(item.itemId, function (err, dbResult) {
                    if (err) {
                        res.status(400)
                        res.json(err.stack)
                    } else {
                        var result = dbResult.rows[0]
                        result.amount = item.amount
                        totalPrice += (result.amount * result.item_price)
                        itemsArray.push(result)
                        count++
                        if(count == requestedData.items.length) {
                            var output = {
                                "userId" : requestedData.userId,
                                "restaurantName" : requestedData.restaurantName, 
                                "items" : itemsArray,
                                "totalPrice" : totalPrice
                            }
                            res.json(output)
                        }
                    }
                })
            })
        } else {
            res.sendStatus(404)
        }
    })

    router.delete('/shoppingCart/:id', (req, res) => {
        let index = data.shoppingCart.findIndex(cart => cart.userId === req.params.id)
        if (index !== -1) {
            // Added security can be added here to make sure that only that user itself can delete the shopping cart using payload containing the user itself
            data.shoppingCart.splice(index, 1)
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }
    })

    return router;

}
