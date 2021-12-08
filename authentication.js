const jwt = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcryptjs')
const customer = require('./models/customer_model')
const restaurant = require('./models/restaurant_model')


// The secret is stored in a environmental variable
// This env var may has to be set manualy, but using
// mpn run test or npm run dev will set it also (on mac/linux)

// The string that is set here should not be used as secret
// please set an env var in your development/testing/runtime environment
const secrets = process.env.SECRET || "this is not a secret"


const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : secrets
}

let sign = (userInfo, isManager) => {
    return jwt.sign({ userId: userInfo.id, isManager: isManager, userInfo: userInfo}, secrets)
}

let signRestaurant = (isManager, restaurantInfo) => {
    return jwt.sign({ isManager: isManager, restaurantInfo: restaurantInfo}, secrets)
}



// This function configures the passport
// middleware correctly
let setup = (passport, data) => {
    // setup JWTStragety

    // Users id is available in req.user.userI
    passport.use("jwt-customer",new JwtStrategy(options, (payload, done) => {
        done(null, {userId: payload.userInfo.id, isManager: payload.isManager, userInfo: payload.userInfo})
    }))

    passport.use("jwt-restaurant",new JwtStrategy(options, (payload, done) => {
        done(null, {isManager: payload.isManager, restaurantInfo: payload.restaurantInfo})
    }))

    // Set up BasicStrategy
    passport.use('customer', new BasicStrategy(
        (email, password, done) => {
            customer.getByEmail(email, function(err, dbResult) {
                if (err) {
                    console.log(err);
                } else {
                   let emailCheck = JSON.stringify(dbResult.rows);
                    if (emailCheck.length > 2){
                        const userInfo = dbResult.rows[0]
                        if (bcrypt.compareSync(password, dbResult.rows[0].customer_password)){
                            done(null, userInfo)
                        } else {
                            done(null, false)
                        }
                    } else {
                        done(null, false)
                    }
                }
            })
        }
    )) 

    passport.use('manager', new BasicStrategy(
        (email, password, done) => {
            restaurant.getByEmail(email, function(err, dbResult) {
                if (err) {
                    console.log(err);
                } else {
                   let emailCheck = JSON.stringify(dbResult.rows);
                    if (emailCheck.length > 2){
                        const restaurantInfo = dbResult.rows[0].restaurant_name
                        console.log(restaurantInfo);
                        if (bcrypt.compareSync(password, dbResult.rows[0].restaurant_password)){
                            done(null, restaurantInfo)
                        } else {
                            done(null, false)
                        }
                    } else {
                        done(null, false)
                    }
                }
            })
        }
    ))
}

module.exports = {
    setup,
    sign,
    signRestaurant
}
