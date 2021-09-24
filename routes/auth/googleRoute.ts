import express from 'express'
import passport from 'passport'

const googleRoute = express.Router()

googleRoute.get('/auth', passport.authenticate('google', {
    scope: ['email', 'profile'],
    failureFlash: true 
}))

googleRoute.get('/callback', passport.authenticate('google', {
    successRedirect: '/acept',
    failureFlash: true
}))

export default googleRoute