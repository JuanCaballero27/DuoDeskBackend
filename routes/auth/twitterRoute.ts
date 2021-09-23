import express from 'express'
import passport from 'passport'

const twitterRoute = express.Router()

twitterRoute.get('/auth', passport.authenticate('twitter', {scope: ['email', 'profile']}))

twitterRoute.get('/callback', passport.authenticate('twitter', {
    successRedirect: '/acept',
    failureRedirect: '/reject'
}))

export default twitterRoute