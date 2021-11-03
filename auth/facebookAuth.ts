import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import User from '../models/User'

import dotenv from 'dotenv'
dotenv.config()

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || ''
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || ''

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/facebook/callback",
    passReqToCallback: true,
    profileFields: [
        'id',
        'displayName',
        'photos',
        'email',
        'first_name',
        'last_name',
        'birthday',
        'location'
    ]
},
    (request: any, accessToken: any, refreshToken: any, profile: any, done: (err: any, user: any) => any) => {
        User.findOne({ email: profile._json.email, provider: 'facebook' }, async (error: any, user: any) => {
            if (error) {
                return done(error, false)
            }
            else if (!user) {
                const newUser = new User({
                    provider: profile.provider,
                    email: profile._json.email,
                    firstName: profile._json.first_name,
                    lastName: profile._json.last_name,
                    image: profile._json.picture.data.url,
                })
                await newUser.save()
                return done(null, newUser)
            }
            else {
                return done(null, user)
            }
        })
    }
))

passport.serializeUser((user: any, done: (error: null, profile: any) => void) => {
    done(null, user)
})

passport.deserializeUser((user: any, done: (error: null, profile: any) => void) => {
    done(null, user)
})