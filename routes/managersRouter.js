const { response } = require('express')

module.exports = function(passport, data) {

    let router = require('express').Router()
    const customer = require('../models/customer_model')


    router.post('/login', passport.authenticate('basic', {session: false}), (req, res) => {
        const token = require('../authentication').sign(req.user.id)
        res.json({token : token})
        // PreviousURL not yet implemented, 
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