module.exports = function(passport, data) {

    const bcrypt = require('bcryptjs')
    let router = require('express').Router()
    const { v4: uuidv4 } = require('uuid');
    const Ajv = require('ajv')
    const ajv = new Ajv()
    const customer = require('../models/customer_model')

    //Initialize JSON Validator
    const customerSchema = require('../schemas/user.schema.json')
    const customerValidator = ajv.compile(customerSchema)

    // Just an example
    router.get('/login',  (req, res) => {
        //i dont think this page need to be handled by the backend because no data is required
        res.send("This should return a login page")
    })

    // OK
    router.post('/login', passport.authenticate('basic', {session: false}), (req, res) => {
        const token = require('../authentication').sign(req.user.id)
        res.json({token : token})
        // Previous URL not yet implemented
    })

    /* 
    There is still a problem with inputing data to the database, field address and emails still have wrong entry inside. 
    Emails are added in address and address in email.
    Possible fix: Check the insertCustomer function and see what is wrong.
    Everything else seems to be working

    Not a priority, will be taken care later in the project
    */
    router.post('/signup', (req, res) => {
        
        const validationResult = managerValidator(req.body)
        if(validationResult) {
            //This should check from the database if the email already exist
            if (data.managers.find(manager => manager.email === req.body.email) != undefined ){
                res.status(409)
                res.send("email already exists in the database")
                return
            }
            const salt = bcrypt.genSaltSync(6)
            const hashedPasswd = bcrypt.hashSync(req.body.password, salt)
            
            let managerId = uuidv4()

            //This should push the data into the database
            console.log(req.body)
            console.log(data)
            data.managers.push({
                id: managerId,
                restaurantName: req.body.restaurantName,
                email: req.body.email,
                password: hashedPasswd,
                restaurantType: req.body.restaurantType,
                openingHour: req.body.openingHour,
                priceRange: req.body.priceRange,
                address: req.body.address
            })
            res.send(managerId)
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