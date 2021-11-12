module.exports = function(passport, data) {

    let router = require('express').Router()

    router.get('/login',  (req, res) => {
        res.send("Test customer")
    })

    return router;
}