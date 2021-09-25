import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'

const twitterRoute = express.Router()

twitterRoute.get('/auth', passport.authenticate('twitter', {scope: ['emails', 'profile']}))

twitterRoute.get('/callback', (request: Request, response: Response, next: NextFunction) => {
    passport.authenticate('twitter', (error, user, info) => {
        console.log("CallBack!!");
        if(error){
            return next(error)
        }
        if(user){
            request.logIn(user, (error) => {
                if(error){
                    console.log(error);
                    return next(error)
                }
                // response.redirect('http://localhost:3000')
                response.redirect('/acept')
            })
        }
    })(request, response, next)
})

export default twitterRoute