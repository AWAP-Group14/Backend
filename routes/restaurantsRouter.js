module.exports = function(passport, data) {

    const bcrypt = require('bcryptjs')
    let router = require('express').Router()
    const { v4: uuidv4 } = require('uuid');
    const Ajv = require('ajv')
    const ajv = new Ajv()
    const restaurant = require('../models/restaurant_model')

    //Initialize JSON Validator
    const menuSchema = require('../schemas/menu.schema.json')
    const menuValidator = ajv.compile(menuSchema)

    const itemSchema = require('../schemas/item.schema.json')
    const itemValidator = ajv.compile(itemSchema)

    const editItemSchema = require('../schemas/item.schema.json')
    const editItemValidator = ajv.compile(editItemSchema)

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
                    res.status(400)
                    res.json(err.stack)
                    
                } else {
                    // res.json(dbResult.rows)
                    res.status(200)
                    res.json(dbResult.rows)
                    
                }
            })
        } else if(req.query.price != undefined) {
            price = parseInt(req.query.price)
            restaurant.getAllFilteredByPrice(price, function(err, dbResult) {
                if (err) {
                    res.status(400)
                    res.json(err.stack)
                } else {
                    // res.json(dbResult.rows)
                    res.status(200)
                    res.json(dbResult.rows)
                    
                }
            })
        } else if(req.query.type != undefined) {
            type = req.query.type
            restaurant.getAllFilteredByType(type, function(err, dbResult) {
                if (err) {
                    res.status(400)
                    res.json(err.stack)
                    
                } else {
                    // res.json(dbResult.rows)
                    res.status(200)
                    res.json(dbResult.rows)
                    
                }
            })
        } else if (req.query.limit != undefined) {
            restaurant.getLimited(req.query.limit, function(err, dbResult) {
                if (err) {
                    res.status(400)
                    res.json(err.stack)
                    
                } else {
                    // res.json(dbResult.rows)
                    res.status(200)
                    res.json(dbResult.rows)
                    
                }
            }) 
        } else {
            restaurant.getAll(function(err, dbResult) {
                if (err) {
                    res.status(400)
                    res.json(err.stack)
                    
                } else {
                    // res.json(dbResult.rows)
                    console.log(dbResult.rows)
                    res.status(200)
                    res.json(dbResult.rows)
                    
                }
            })
        }
        
        
    })

    //get restaurant by name
    router.get('/:name', (req, res) => {
        restaurant.getByName(req.params.name, function (err, dbResult) {
            if (err) {
                res.status(400)
                res.json(err.stack)
                
            } else if (dbResult.rows.length == 0){
                res.status(404)
                res.json("Restaurant not found")
            } else {
                res.status(200)
                res.json(dbResult.rows)
                
            }
        })
    })

    router.post('/:name/item', (req, res) => {
        
        const validationResult = itemValidator(req.body)

        if(validationResult) {
            let itemId = uuidv4()
            restaurant.insertItem(itemId, req.body, function (err, dbResult) {
                if (err) {
                    res.status(404) 
                    res.send("Menu not found")
                } else {
                    res.status(200)
                    res.json(dbResult.rows)
                    
                }
            })
        } else {
            res.sendStatus(400)
        }
    })

    router.put('/:name/item/:id', (req, res) => {
        const validationResult = editItemValidator(req.body)

        if(validationResult) {
            restaurant.updateItem(req.params.id, req.body, function (err, dbResult) {
                if (err) {
                    res.status(400) 
                    res.json(err.stack)
                } else if(dbResult.rows.length == 0) {
                    res.status(404)
                    res.send("Item to edit not found")
                } else {
                    res.status(200)
                    res.json(dbResult.rows)
                    
                }
            })
        } else {
            res.sendStatus(400)
        }
    })

    router.delete('/:name/item/:id', (req, res) => {
        restaurant.deleteItem(req.params.id, function (err, dbResult) {
            if (err) {
                res.status(400) 
                res.json(err.stack)
            } else {
                res.send("item deleted")
                res.status(200)
            }
        })
    })

    router.get("/:name/menu", (req, res) => {
        restaurant.getMenu(req.params.name, function (err, dbResult) {
            if (err) {
                res.status(400) 
                res.json(err.stack)
            } else {
                res.status(200)
                res.json(dbResult.rows)
                
            }
        })
    })

    router.post("/:name/menu", (req, res) => {
        const validationResult = menuValidator(req.body)

        if(validationResult) {
            
            let menuId = uuidv4()
            restaurant.insertMenu(menuId, req.body, function (err, dbResult) {
                if (err) {
                    res.status(404) 
                    res.send("Restaurant name not found")
                } else {
                    res.status(200)
                    res.json(dbResult.rows)
                    
                }
            })
        } else {
            res.sendStatus(400)
        }
    })

    router.put("/:name/menu/:id", (req, res) => {
        
        const validationResult = menuValidator(req.body)

        if(validationResult) {
            restaurant.updateMenu(req.params.id, req.body, function (err, dbResult) {
                if (err) {
                    res.status(400) 
                    res.json(err.stack)
                } else if(dbResult.rows.length == 0) {
                    res.status(404)
                    res.send("Menu to edit not found")
                } else {
                    res.status(200)
                    res.json(dbResult.rows)
                    
                }
            })
        } else {
            res.sendStatus(400)
        }
    })

    router.delete("/:name/menu/:id", (req, res) => {
        // Not working yet, need to cascade the table first. Look restaurant_model
        restaurant.deleteMenu(req.params.id, function (err, dbResult) {
            if (err) {
                res.status(400) 
                res.json(err.stack)
            } else {
                res.status(200)
                res.json(dbResult.rows)               
            }
        })
    })

    return router;

}