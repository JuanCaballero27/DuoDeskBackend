import express from 'express'
import passport from 'passport'

const facebookRoute = express.Router()

facebookRoute.get('/auth', passport.authenticate('facebook', {scope: ['email']}))

facebookRoute.get('/callback', passport.authenticate('facebook', {
    successRedirect: '/acept',
    failureRedirect: '/reject'
}))

export default facebookRoute