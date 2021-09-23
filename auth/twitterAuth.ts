import passport, { Profile } from 'passport'
import passportTwiter from 'passport-twitter'

const TwitterStrategy = passportTwiter.Strategy;

const TWITTER_CONSUMER_KEY = "A5NFiwm1gnqIBzPvLYieYnetw"
const TWITTER_CONSUMER_SECRET = "EwWzRePqLX7gDLtsz4MPmdCtqlBZ95iny46NnNE0PdwKjYxczI"

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:5000/twitter/callback"
    },
    (token: string, tokenSecret: any, profile: Profile, done:  (error: any, user?: any) => void) => {
        return done(null, profile)
    }
))

passport.serializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
    done(null, user)
})

passport.deserializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
    done(null, user)
})