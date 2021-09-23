export { }
const passport = require('passport')
const MicrosoftStrategy = require('passport-microsoft').Strategy;

const MICROSOFT_CLIENT_ID = "541e8840-28fe-4bef-ab3f-835689067bd6"
const MICROSOFT_CLIENT_SECRET = "CJ~7Q~B.3m1jfV9VyWCbbxR7XTJsLAWjY.ojD"
// const MICROSOFT_CLIENT_SECRET = "df4b9e33-08eb-4bd6-b8df-a439ffd567c8"

passport.use(new MicrosoftStrategy({
        clientID: MICROSOFT_CLIENT_ID,
        clientSecret: MICROSOFT_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/microsoft/callback',
        passReqToCallback: true,
        scope: ['user.read']
    },
    (request: any, accessToken: any, refreshToken: any, profile: any, done: (arg0: null, arg1: any) => any) => {
        return done(null, profile);
    })
);

passport.serializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
    done(null, user)
})

passport.deserializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
    done(null, user)
})