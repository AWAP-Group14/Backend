let router = require('express').Router()
const { v4: uuidv4 } = require('uuid');
const order = require('../models/order_model')
const Ajv = require('ajv')
const ajv = new Ajv()

//Initialize JSON Validator
const shoppingCartSchema = require('../schemas/user.schema.json')
const shopiingCartValidator = ajv.compile(shoppingCartSchema)


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
    });

    // router.post('/shoppingCart/:id', function (req, res) {
        
    //     const validationResult = shopiingCartValidator(req.body)
    //     if(validationResult) {
            
    //         //This should push the data into the database
    //         console.log(req.body)
    //         if (data.shoppingCart.find(cart => shoppingCart.userId === req.body.email) != undefined ){
    //             res.status(409)
    //             res.send("email already exists in the database")
    //             return
    //         }
    //         data.shoppingCart.push({
    //             userId = req.body.userId,
    //             restaurantId = req.body.restaurantId,

    //         })
    //         res.status(200)
    //         res.send("Item succesfully added to the shopping cart")
    //     } else {
    //         res.sendStatus(400)
    //     }
    // })

    // router.get('/shoppingCart/:id',  (req, res) => {
    //     //i dont think this page need to be handled by the backend because no data is required
    //     res.send("It works")
    // })


    return router;

}
