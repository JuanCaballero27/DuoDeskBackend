import passport from 'passport'
import { Strategy as MicrosoftStrategy } from 'passport-microsoft'
import User from '../models/User'

const MICROSOFT_CLIENT_ID = "541e8840-28fe-4bef-ab3f-835689067bd6"
const MICROSOFT_CLIENT_SECRET = "CJ~7Q~B.3m1jfV9VyWCbbxR7XTJsLAWjY.ojD"

passport.use(new MicrosoftStrategy({
        clientID: MICROSOFT_CLIENT_ID,
        clientSecret: MICROSOFT_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/microsoft/callback',
        passReqToCallback: true,
        scope: ['user.read']
    },
    (request:any, accessToken:any, refreshToken:any, profile: any, done: (err: any, user: any) => any) => {
        User.findOne({email: profile.email}, async (error:any, user:any) => {
            if(error){
                return done(error, false)
            }
            else if(!user){
                const newUser = new User({
                    provider: profile.provider,
                    email: profile._json.mail,
                    typeEmail: profile.emails.find((email:any) => {
                        return profile._json.mail === email.value
                    })["type"],
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                })
                await newUser.save()
                return done(null, profile)
            }
            else{
                return done(null, profile)        
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