const jwt = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcryptjs')


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

let sign = (userId) => {
    return jwt.sign({ userId: userId }, secrets)
}



// This function configures the passport 
// middleware correctly
let setup = (passport, data) => {
    // setup JWTStragety

    // Users id is available in req.user.userI
    passport.use(new JwtStrategy(options, (payload, done) => {
        done(null, {userId: payload.userId})
    }))

    // Set up BasicStrategy
    passport.use(new BasicStrategy(
        (email, password, done) => {
            const user = data["users"].find(
                user => {
                    if (user.email === email){
                        if (bcrypt.compareSync(password, user.password)){
                            return true
                        } else {
                            return false
                        }
                    }
                }
            )
            if (user != undefined){
                done(null, user)
            } else {
                done(null, false)
            }
        }
    ))
    console.log("Basic configured")
}

module.exports = {
    setup,
    sign
}