//const { response } = require('express')

module.exports = function(passport, data) {

    const customer = require('../models/customer_model')
    const bcrypt = require('bcryptjs')
    let router = require('express').Router()
    const { v4: uuidv4 } = require('uuid');
    const Ajv = require('ajv')
    const ajv = new Ajv()
    const client = require('../database');

    //Initialize JSON Validator
    const managerSchema = require('../schemas/manager.schema.json')
    const managerValidator = ajv.compile(managerSchema)


    router.post('/login', passport.authenticate('basic', {session: false}), (req, res) => {
        const token = require('../authentication').sign(req.user.id)
        res.json({token : token})
        // PreviousURL not yet implemented, 
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
