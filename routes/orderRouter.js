let router = require('express').Router()
const { v4: uuidv4 } = require('uuid');
const order = require('../models/order_model')

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

    return router;

}
