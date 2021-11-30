module.exports = function(passport, data) {

    const bcrypt = require('bcryptjs')
    let router = require('express').Router()
    const { v4: uuidv4 } = require('uuid');
    const Ajv = require('ajv')
    const ajv = new Ajv()
    const restaurant = require('../models/restaurant_model')

    //Initialize JSON Validator
    const managerSchema = require('../schemas/manager.schema.json')
    const managerValidator = ajv.compile(managerSchema)

    // const customerSchema = require('../schemas/user.schema.json')
    // const customerValidator = ajv.compile(customerSchema)

    //get restaurants with filters
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
                    // res.json(dbResult.rows)
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
                    // res.json(dbResult.rows)
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
                    // res.json(dbResult.rows)
                    res.json(dbResult.rows)
                    res.status(200)
                }
            })
        } else if (req.query.limit != undefined) {
            restaurant.getLimited(req.query.limit, function(err, dbResult) {
                if (err) {
                    res.json(err.stack)
                    res.status(400)
                } else {
                    // res.json(dbResult.rows)
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
                    // res.json(dbResult.rows)
                    console.log(dbResult.rows)
                    res.json(dbResult.rows)
                    res.status(200)
                }
            })
        }
        
        
    })

    //get restaurant by name
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

    router.post('/signup', async (req, res) => {

        
        const validationResult = managerValidator(req.body)

        if(validationResult) {
            //This should check from the database if the email already exist

            restaurant.getByNameAndEmail(req.body.restaurantName, req.body.email, function(err, dbResult) {
                if (err) {
                    response.json(err);
                } else {
                   let emailCheck = JSON.stringify(dbResult.rows);
                    console.log(emailCheck +" email from db");

                    console.log("emailcheck lenght "+emailCheck.length);

                    if (emailCheck.length > 2){
                        res.status(409)
                        res.send("email or restaurant name already exists in the database")
                        return
                    }
        
            
                    const salt = bcrypt.genSaltSync(6)
                    const hashedPasswd = bcrypt.hashSync(req.body.password, salt)
        
                    let customerId = uuidv4()
        
                    //This should push the data into the database
                    restaurant.insertRestaurant(req.body, hashedPasswd, function(err, dbResult) {
                        if (err) {
                            console.log(err.stack)
                        } else {
                            console.log(dbResult.rows)
                        }
                    })
                    
                    res.send("restaurant added")

                }
            });

        } else {
            res.sendStatus(400)
        }
        
    })



    return router;

}