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
        
        const validationResult = customerValidator(req.body)
        if(validationResult) {
            //This should check from the database if the email already exist
            customer.getByEmail(req.body.email, function(err, dbResult) {
                if (err) {
                    res.status(400)
                    res.send(err.stack)
                    return
                } else if (dbResult.rows.length > 0){
                    res.status(409)
                    res.send("email already exists in the database")
                    return
                } else {        
                    /* if (data.users.find(user => user.email === req.body.email) != undefined ){
                        res.status(409)
                        res.send("email already exists in the database")
                        return
                    } */
                    const salt = bcrypt.genSaltSync(6)
                    const hashedPasswd = bcrypt.hashSync(req.body.password, salt)
                    
                    let userId = uuidv4()

                    //This should push the data into the database
                    /* data.users.push({
                        id: userId,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        address: req.body.address,
                        phone: req.body.phone,
                        email: req.body.email,
                        password: hashedPasswd
                    })
                    */
                    console.log(dbResult.rows.length)
                    customer.insertCustomer(userId, req.body, hashedPasswd, function(err, dbResult) {
                        if (err) {
                            res.status(400)
                            res.send(err.stack)
                            return
                        } else {
                            console.log(dbResult.rows)
                            res.status(200)
                            res.send("User created")
                        }
                    })       

                        }
                    })          
        } else {
            res.status(400)
        }  
    })

    router.get('/restaurants',  (req, res) => {
        //i dont think this page need to be handled by the backend because no data is required
        res.send("This should return a login page")
    })

    return router;

}