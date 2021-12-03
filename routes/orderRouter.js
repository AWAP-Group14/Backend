let router = require('express').Router()
const { v4: uuidv4 } = require('uuid');
const order = require('../models/order_model')
const restaurant = require('../models/restaurant_model')
const Ajv = require('ajv')
const ajv = new Ajv()


//Initialize JSON Validator
const shoppingCartSchema = require('../schemas/shoppingCart.schema.json');
const shoppingCartValidator = ajv.compile(shoppingCartSchema)
const orderSchema = require('../schemas/order.schema.json');
const orderValidator = ajv.compile(orderSchema)
const editOrderSchema = require('../schemas/editOrder.schema.json');
const editOrderValidator = ajv.compile(editOrderSchema)
const editShoppingCartSchema = require('../schemas/editShoppingCart.schema.json');
const editShoppingCartValidator = ajv.compile(editShoppingCartSchema)

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
                        response.json(err.stack);
                    } else {
                        response.json(dbResult.rows);
                    }
                });
            } else {
                order.getAll(function(err, dbResult) {
                    if (err) {
                        response.json(err.stack);
                    } else {
                        response.json(dbResult.rows);
                    }
                }); 
            }
        }
    );

    //get customer order history
    router.get('/history/:id?',
    function(request, response) {
            order.getByCustomerId(request.params.id, function(err, dbResult) {
                if (err) {
                    response.json(err.stack);
                } else {
                    response.json(dbResult.rows);
                }
            });
        }
    );  

    //get customer active orders
    router.get('/active/:id?',
        function(request, response) {
                order.getActiveByCustomerId(request.params.id, function(err, dbResult) {
                    if (err) {
                        response.json(err.stack);
                    } else {
                        response.json(dbResult.rows);
                    }
                });
        }
    );
    
    const addDate = () => {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes()
        var dateTime = date+' '+time;
        return dateTime
    }

    router.post('/', function(req, res) { 
        const validationResult = orderValidator(req.body)
        if(validationResult) {
            let orderId = uuidv4()
            let index = data.shoppingCart.findIndex(cart => (cart.userId === req.body.customer_id))
            if (index != -1) {
                var items =  JSON.stringify(data.shoppingCart[index].items)
                var totalPrice = data.shoppingCart[index].totalPrice
                var date = addDate()
                order.insertOrder(orderId, items, totalPrice, req.body, date, function(err, dbResult) {
                    if (err) {
                        res.status(400)
                        res.json(err.stack);
                    } else {
                        res.json(dbResult.rows);
                    }
                })
                data.shoppingCart.splice(index, 1)
            } else {
                res.status(400)
                res.send("Shopping cart is empty, order cannot be processed")
            }
        } else {
            res.sendStatus(400)
        }
    })

    router.put('/:id', function (req, res) {
        const validationResult = editOrderValidator(req.body)
        if(validationResult) {
            order.updateOrder(req.params.id, req.body, function(err, dbResult) {
                if (err) {
                    res.status(400)
                    res.json(err.stack);
                } else if(dbResult.rows.length < 1) {
                    res.sendStatus(404)
                } else {
                    res.json(dbResult.rows);
                }
            })  
        } else {
            res.sendStatus(400)
        }
    })

    router.delete('/:id', function(req, res) {
        order.deleteOrder(req.body, function(err, dbResult) {
            if (err) {
                res.status(400)
                res.json(err.stack);
            } else {
                res.status
                res.json(dbResult.rows);
            }
        })
    })

    router.put('/changeStatus/:id', function (req, res) {
        if(!req.query.status) {
            res.status(400)
            res.send("Query parameter status is required")
        } else {
            order.changeOrderStatus(req.params.id, req.query.status, function(err, dbResult) {
                if (err) {
                    res.status(400)
                    res.json(err.stack);
                } else {
                    res.json(dbResult.rows);
                }
            })  
        }
    })

    //------------------SHOPPING CART-------------------------
    router.post('/shoppingCart/:id', function (req, res) {
        
        const validationResult = shoppingCartValidator(req.body)
        if(validationResult) {
            var indexToDelete = -1
            var itemsArray = []
            var totalPrice = 0
            let index = data.shoppingCart.findIndex(cart => (cart.userId === req.params.id && cart.restaurantName === req.body.restaurantName))
            if (index != -1 ) {
                var itemExist = false
                restaurant.getItem(req.body.itemId, function (err, dbResult) {
                    if (err) {
                        res.status(400)
                        res.json(err.stack);
                    } else if (dbResult.rows.length > 0) {
                        var result = dbResult.rows[0]
                        result.amount = req.body.amount
                        totalPrice = (result.amount * result.item_price)
                        itemsArray.push(result)
                        
                        //Adding the right amount
                        data.shoppingCart[index].items.forEach((item, itemIndex) => {
                            if((item.id == req.body.itemId) && (req.query.reduce != "1")) {
                                item.amount += req.body.amount
                                itemExist = true 
                                data.shoppingCart[index].totalPrice += (req.body.amount * item.item_price)
                            } else if ((item.id == req.body.itemId) && (req.query.reduce == "1")){
                                item.amount -= req.body.amount
                                itemExist = true 
                                data.shoppingCart[index].totalPrice -= (req.body.amount * item.item_price)
                                if(item.amount < 1) {
                                    indexToDelete = itemIndex
                                }
                            }
                        })
                        if((!itemExist) && (req.query.reduce != "1")) {
                            data.shoppingCart[index].items.push(result)
                            data.shoppingCart[index].totalPrice += totalPrice
                        }

                        if(indexToDelete != -1) {
                            data.shoppingCart[index].items.splice(indexToDelete, 1)
                        }
                        res.status(200)
                        res.send("Item succesfully added or deleted to an existing the shopping cart")
                        
                    } else {
                        res.status(404)
                        res.send("Item ID does not exist")
                    }
                })

            } else {
                restaurant.getItem(req.body.itemId, function (err, dbResult) {
                    if (err) {
                        res.status(400)
                        res.json(err.stack);
                    } else if (dbResult.rows.length > 0) {
                        var result = dbResult.rows[0]
                        result.amount = req.body.amount
                        totalPrice += (result.amount * result.item_price)
                        itemsArray.push(result)
                        data.shoppingCart.push({
                            userId : req.params.id,
                            restaurantName : req.body.restaurantName,
                            items: itemsArray,
                            totalPrice : totalPrice   
                        })
                        res.status(200)
                        res.send("Item succesfully added to a new shopping cart")
                    } else {
                        res.status(404)
                        res.send("Item ID does not exist")
                    }
                })
            }
            // console.log(data.shoppingCart[index])
        } else {
            res.sendStatus(400)
        }
    })

    router.get('/shoppingCart/:id', (req, res) => {
        let index = data.shoppingCart.findIndex(cart => cart.userId === req.params.id)
        var itemsArray = []
        var count = 0
        if (index !== -1) {
            res.status(200)
            res.json(data.shoppingCart[index])
        } else {
            res.sendStatus(404)
        }
    })

    router.put('/shoppingCart/:id', (req, res) => {
        const validationResult = editShoppingCartValidator(req.body)
        if(validationResult) {
            let index = data.shoppingCart.findIndex(cart => cart.userId === req.params.id)
            if (index !== -1) {
                data.shoppingCart[index].items = req.body.items
                data.shoppingCart[index].totalPrice = req.body.totalPrice
                res.status(200)
                res.send("Shopping cart succesfully updated")
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(400)
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
