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