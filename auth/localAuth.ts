import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { verifyPassword } from '../utils/functions';
import User from '../models/User'

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    (request, username, password, done) => {
        User.findOne({email: request.body.email, provider: "local"}, async (error: any, user: any) => {
            if (error) { 
                return done(error, false)
            }
            if (!user) {
                return done(null, false, {message: 'There is not such user'}) 
            }
            const verification = await verifyPassword(request.body.password, user.password) 
            if (!verification) { 
                return done(null, false) 
            }
            return done(null, user)
        });
    }
))

passport.serializeUser((user, done: (error: null, profile: any) => void) => {
    done(null, user)
})

passport.deserializeUser((user: any, done: (error: null, profile: any) => void) => {
    console.log('SERIALIZE', User)
    done(null, user)
})