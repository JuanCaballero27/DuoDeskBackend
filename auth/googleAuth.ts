export {}
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = '1091858905525-dnaq3u772ks6e3dc98c0guggp5t42lcj.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = 'oWk5-J5dnD4-JAlBpKAOcA3p'

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/google/callback",
        passReqToCallback: true,
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