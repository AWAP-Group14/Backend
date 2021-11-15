const { response } = require('express')

module.exports = function(passport, data) {

    let router = require('express').Router()
    const customer = require('../models/customer_model')


    router.get('/:id?',
    function(request, response) {
        if (request.params.id) {
            customer.getById(request.params.id, function(err, dbResult) {
         if (err) {
             response.json(err);
         } else {
            response.json(dbResult.rows);
        }
        });
        } else {
            customer.getAll(function(err, dbResult) {
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