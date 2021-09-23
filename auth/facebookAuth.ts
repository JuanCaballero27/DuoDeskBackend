export { }
const passport = require('passport')
const FacebookStrategy = require('passport-facebook')

const FACEBOOK_APP_ID = "394186002113536"
const FACEBOOK_APP_SECRET = "c862b1d523e14741aeeae8ee98e19722"

passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:5000/facebook/callback",
        passReqToCallback: true,
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (request: any, accessToken: any, refreshToken: any, profile: any, done: (arg0: null, arg1: any) => any) => {
        return done(null, profile);
    })
)

passport.serializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
    done(null, user)
})

passport.deserializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
    done(null, user)
})