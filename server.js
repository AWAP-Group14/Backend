// Note that to keep this file (and others) neat and tidy
// the code was split up into multiple files.


const express =  require('express')
const app = express()
const passport = require('passport')


// Set up global data state
var data = require('./data')

// Setup authentication
// This funtion will configure all authentication stuff
// including http basic and jwt using passport
require('./authentication').setup(passport, data)


// json parsing middleware (bodyparser is deprecated)
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

// Import routes
// The imports are actually functions that create a router
// object using the above created passport and data objects
let customersRoutes = require('./routes/customersRouter')(passport, data)
let managersRoutes = require('./routes/managersRouter')(passport, data)

// Attatch the imported routes to the corresponding endpoints
app.use('/', customersRoutes)
app.use('/manager', managersRoutes)


// redirect root request to api documentation
app.get('/',(req, res) => {
  res.send("Hello world")
})


// if a port is provided via env var use it, otherwise use port 3000
const port = process.env.PORT || 3000

// placeholder for an instance of the server
let serverInstance = null

// Now export two functions to start and stop the server from another script
module.exports = {
  start: () => {
    serverInstance = app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  },
  close: () => {
    serverInstance.close()
  }
}