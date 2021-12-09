//const { response } = require('express')

module.exports = function(passport, data) {

    const customer = require('../models/customer_model')
    const bcrypt = require('bcryptjs')
    let router = require('express').Router()
    const { v4: uuidv4 } = require('uuid');
    const Ajv = require('ajv')
    const ajv = new Ajv()
    const multer = require('multer')
    const restaurant = require('../models/restaurant_model')

    var cloudinary = require('cloudinary').v2;
    var { CloudinaryStorage } = require('multer-storage-cloudinary');

    //initialize cloudinaryStorage
    var storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        folder: 'images',
        allowedFormats: ['jpg', 'png']
    })
    const parser = multer({ storage: storage });

    //Initialize JSON Validator
    const managerSchema = require('../schemas/manager.schema.json')
    ajv.addKeyword('isNotEmpty', {
        type: 'string',
        validate: function (schema, data) {
          return typeof data === 'string' && data.trim() !== ''
        },
        errors: false
      })
    
    const managerValidator = ajv.compile(managerSchema)


    router.post('/login', passport.authenticate('manager', {session: false}), (req, res) => {
        const token = require('../authentication').signRestaurant(true, req.user)
        res.json({token : token})
        // PreviousURL not yet implemented, 
    })

    
    //upload image
    router.post('/upload', parser.single('image'), function(req, res){
        res.json(req.file.path)
    })

    router.post('/signup', parser.single('image'), async (req, res) => {

        const validationResult = managerValidator(req.body)

        if(validationResult) {
            //This should check from the database if the email already exist

            restaurant.getByNameAndEmail(req.body.restaurantName, req.body.email, function(err, dbResult) {
                if (err) {
                    response.json(err);
                } else {
                   let emailCheck = JSON.stringify(dbResult.rows);
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


    return router;
}
