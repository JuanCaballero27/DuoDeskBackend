import passport from 'passport'
import { Strategy as MicrosoftStrategy } from 'passport-microsoft'
import User from '../models/User'

import dotenv from 'dotenv'
dotenv.config()

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || ''
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || ''

passport.use(new MicrosoftStrategy({
    clientID: MICROSOFT_CLIENT_ID,
    clientSecret: MICROSOFT_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/microsoft/callback',
    passReqToCallback: true,
    scope: ['user.read']
},
    (request: any, accessToken: any, refreshToken: any, profile: any, done: (err: any, user: any) => any) => {
        User.findOne({ provider: 'microsoft', email: profile._json.userPrincipalName }, async (error: any, user: any) => {
            if (error) {
                return done(error, false)
            }
            else if (!user) {
                const newUser = new User({
                    provider: profile.provider,
                    email: profile._json.mail,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: `https://avatars.dicebear.com/api/open-peeps/${(profile._json.mail + profile.name.givenName).replaceAll(/\s/g,'')}.svg?face=smileBig`
                })
                if (profile.emails.length === 1) {
                    newUser.email = profile.emails[0].value
                    newUser.typeEmail = profile.emails[0].type
                }
                else {
                    newUser.typeEmail = profile.emails.find((email: any) => {
                        return profile._json.mail === email.value
                    })["type"]
                }
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