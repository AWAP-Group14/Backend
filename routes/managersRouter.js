module.exports = function(passport, data) {

    let router = require('express').Router()

    router.get('/',  (req, res) => {
        res.send("Test manager")
    })
    return router;
}