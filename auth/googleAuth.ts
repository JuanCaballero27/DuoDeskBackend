import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import User from '../models/User'

import dotenv from 'dotenv'
dotenv.config()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback",
    passReqToCallback: true,
},
    (request: any, accessToken: any, refreshToken: any, profile: any, done: (err: any, user: any) => any) => {
        User.findOne({ email: profile.email, provider: 'google' }, async (error: any, user: any) => {
            if (error) {
                return done(error, false)
            }
            else if (!user) {
                const newUser = new User({
                    provider: profile.provider,
                    email: profile.email,
                    typeEmail: profile.emails.find((email: any) => {
                        return profile.email === email.value
                    })["type"],
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    image: profile.picture,
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