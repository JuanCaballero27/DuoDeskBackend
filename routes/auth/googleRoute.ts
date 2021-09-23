import express from 'express'
import passport from 'passport'

const googleRoute = express.Router()

googleRoute.get('/auth', passport.authenticate('google', {scope: ['email', 'profile']}))

googleRoute.get('/callback', passport.authenticate('google', {
    successRedirect: '/acept',
    failureRedirect: '/reject'
}))

export default googleRoute