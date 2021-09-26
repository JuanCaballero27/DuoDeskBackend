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
    function(request, username, password, done) {
        User.findOne({ email: username, provider: 'local' }, async (err: any, user: any) => {
            if (err) { 
                return done(err, false)
            }
            if (!user) {
                return done(null, false, {message: 'There is not such user'}) 
            }
            const verification = await verifyPassword(password, user.password) 
            if (!verification) { 
                return done(null, false, {
                    message: `Authentication failled:
                    ---------------------------------
                    user password: ${user.password}
                    in Password: ${password}
                    verification: ${verification}`
                }) 
            }
            return done(null, user);
        });
    }
))

passport.serializeUser((user: any, done: (error: null, profile: any) => void) => {
    done(null, user)
})

passport.deserializeUser((user: any, done: (error: null, profile: any) => void) => {
    done(null, user)
})