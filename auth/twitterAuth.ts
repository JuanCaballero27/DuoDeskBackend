import passport from 'passport'
import { Strategy as TwitterStrategy} from 'passport-twitter'
import User from '../models/User'
import { parseName } from '../utils/functions'

const TWITTER_CONSUMER_KEY = "A5NFiwm1gnqIBzPvLYieYnetw"
const TWITTER_CONSUMER_SECRET = "EwWzRePqLX7gDLtsz4MPmdCtqlBZ95iny46NnNE0PdwKjYxczI"

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:5000/twitter/callback",
    passReqToCallback: true,
    includeEmail: true,
    includeEntities: true,
    includeStatus: true,
    },
    (request:any, accessToken:any, refreshToken:any, profile: any, done: (err: any, user: any) => any) => {
        User.findOne({email: profile.email}, async (error:any, user:any) => {
            if(error){
                return done(error, false)
            }
            else if(!user){
                const names = parseName(profile.displayName)
                const newUser = new User({
                    provider: profile.provider,
                    email: profile.email || profile._json.email,
                    firstName: names.name,
                    lastName: names.lastName + names.secondLastName,
                    image: profile._json.profile_image_url_https,
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