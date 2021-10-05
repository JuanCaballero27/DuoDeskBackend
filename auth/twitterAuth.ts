import passport from 'passport'
import { Strategy as TwitterStrategy} from 'passport-twitter'
import User from '../models/User'
import { parseName } from '../utils/functions'

const TWITTER_CONSUMER_KEY = "cAckKJu07i0OsBvH45k7gcqA0"
const TWITTER_CONSUMER_SECRET = "gFBewiawjO6KTqLCGtMvmuvsSnqC0ae7LAIzZLPKXTyAAOJHgn"

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:5000/twitter/callback",
    includeEmail: true,
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    
},
    (accessToken:any, refreshToken:any, profile: any, done: (error: any, user: any) => any) => {
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
                return done(null, newUser)
            }
            else{
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