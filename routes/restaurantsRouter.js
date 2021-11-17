module.exports = function(passport, data) {

    const bcrypt = require('bcryptjs')
    let router = require('express').Router()
    const { v4: uuidv4 } = require('uuid');
    const Ajv = require('ajv')
    const ajv = new Ajv()
    const restaurant = require('../models/restaurant_model')

    //Initialize JSON Validator
    // const customerSchema = require('../schemas/user.schema.json')
    // const customerValidator = ajv.compile(customerSchema)

    router.get('/',  (req, res) => {
        var price = 0
        var type = ""

        if(req.query.price != undefined && req.query.type != undefined) {    
            price = parseInt(req.query.price)
            type = req.query.type

            restaurant.getAllFilteredByPriceAndType(price, type, function(err, dbResult) {
                if (err) {
                    res.json(err.stack)
                    res.status(400)
                } else {
                    res.json(dbResult.rows)
                    res.status(200)
                }
            })
        } else if(req.query.price != undefined) {
            price = parseInt(req.query.price)
            restaurant.getAllFilteredByPrice(price, function(err, dbResult) {
                if (err) {
                    res.json(err.stack)
                    res.status(400)
                } else {
                    res.json(dbResult.rows)
                    res.status(200)
                }
            })
        } else if(req.query.type != undefined) {
            type = req.query.type
            restaurant.getAllFilteredByType(type, function(err, dbResult) {
                if (err) {

                    res.json(err.stack)
                    res.status(400)
                } else {
                    res.json(dbResult.rows)
                    res.status(200)
                }
            })
        } else {
            restaurant.getAll(function(err, dbResult) {
                if (err) {
                    res.json(err.stack)
                    res.status(400)
                } else {
                    res.json(dbResult.rows)
                    res.status(200)
                }
            })
        }
        
        
    })

    router.get('/:name', (req, res) => {
        restaurant.getByName(req.params.name, function (err, dbResult) {
            if (err) {
                res.json(err.stack)
                res.status(400)
            } else if (dbResult.rows.length == 0){
                res.json("Restaurant not found")
                res.status(404)
            } else {
                res.json(dbResult.rows)
                res.status(200)
                
            }
        })
    })

    return router;

}