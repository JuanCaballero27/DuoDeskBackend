import express from 'express'
import passport from 'passport'

const microsoftRoute = express.Router()

microsoftRoute.get('/auth', passport.authenticate('microsoft'))
microsoftRoute.get('/callback', passport.authenticate('microsoft', {
    successRedirect: '/acept',
    failureRedirect: '/reject'
}))

export default microsoftRoute