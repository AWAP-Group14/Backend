module.exports = function(passport, data) {

    const bcrypt = require('bcryptjs')
    let router = require('express').Router()
    const { v4: uuidv4 } = require('uuid');
    const Ajv = require('ajv')
    const ajv = new Ajv()

    //Initialize JSON Validator
    const userSchema = require('../schemas/user.schema.json')
    const userValidator = ajv.compile(userSchema)


    router.get('/login',  (req, res) => {
        //i dont think this page need to be handled by the backend because no data is required
        res.send("This should return a login page")
    })

    router.post('/login', passport.authenticate('basic', {session: false}), (req, res) => {
        const token = require('../authentication').sign(req.user.id)
        res.json({token : token})
    })

    router.post('/signup', (req, res) => {
        
        const validationResult = userValidator(req.body)
        if(validationResult) {
            //This should check from the database if the email already exist
            if (data.users.find(user => user.email === req.body.email) != undefined ){
                res.status(409)
                res.send("email already exists in the database")
                return
            }
            const salt = bcrypt.genSaltSync(6)
            const hashedPasswd = bcrypt.hashSync(req.body.password, salt)
            
            let userId = uuidv4()

            //This should push the data into the database
            data.users.push({
                id: userId,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                password: hashedPasswd
            })
            res.send(userId)
        } else {
            res.sendStatus(400)
        }
        
    })

    return router;
}