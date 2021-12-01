const { response } = require('express');
const { insertCustomer, getByEmail } = require('../models/customer_model');

module.exports = function(passport, data) {

    const bcrypt = require('bcryptjs')
    let router = require('express').Router()
    const { v4: uuidv4 } = require('uuid');
    const Ajv = require('ajv')
    const ajv = new Ajv()
    const customer = require('../models/customer_model')

    //Initialize JSON Validator
    const customerSchema = require('../schemas/user.schema.json')
    ajv.addKeyword('isNotEmpty', {
        type: 'string',
        validate: function (schema, data) {
          return typeof data === 'string' && data.trim() !== ''
        },
        errors: false
      })
    
    const customerValidator = ajv.compile(customerSchema)

    // Just an example
    router.get('/',  passport.authenticate ('jwt' , {session: false} ),(req, res) => {
        //i dont think this page need to be handled by the backend because no data is required
        res.send("It works")
        console.log(req.user);
    })

    // OK
    router.post('/login', passport.authenticate('customer', {session: false}), (req, res) => {
        console.log(req.user);
        const token = require('../authentication').sign(req.user, false)
        res.json({token : token})
        // Previous URL not yet implemented
    })

    router.post('/authenticate', passport.authenticate('jwt', {session: false}), (req, res) => {
        res.sendStatus(200)
    })



    /* 
    There is still a problem with inputing data to the database, field address and emails still have wrong entry inside. 
    Emails are added in address and address in email.
    Possible fix: Check the insertCustomer function and see what is wrong.
    Everything else seems to be working

    Not a priority, will be taken care later in the project
    */

    

    router.post('/signup', async (req, res) => {

        
        
        const validationResult = customerValidator(req.body)

        if(validationResult) {
            //This should check from the database if the email already exist

            customer.getByEmail(req.body.email, function(err, dbResult) {
                if (err) {
                    response.json(err);
                } else {
                   let emailCheck = JSON.stringify(dbResult.rows);
                    console.log(emailCheck +" email from db");

                    console.log("emailcheck lenght "+emailCheck.length);

                    if (emailCheck.length > 2){
                        res.status(409)
                        res.send("email already exists in the database")
                        return
                    }
        
            
                    const salt = bcrypt.genSaltSync(6)
                    const hashedPasswd = bcrypt.hashSync(req.body.password, salt)
        
                    let customerId = uuidv4()
        
                    //This should push the data into the database
                    customer.insertCustomer(customerId, req.body, hashedPasswd, function(err, dbResult) {
                        if (err) {
                            console.log(err.stack)
                        } else {
                            console.log(dbResult.rows)
                        }
                    })
                    
                    res.send("customer added")

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

router.get('/email/:email?',
    function(request, response) {
        if (request.params.email) {
            customer.getByEmail(request.params.email, function(err, dbResult) {
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