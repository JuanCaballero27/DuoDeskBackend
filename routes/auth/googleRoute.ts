import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'

const googleRoute = express.Router()

googleRoute.get('/auth', passport.authenticate('google', {
    scope: ['email', 'profile'],
    failureFlash: true 
}))

googleRoute.get('/callback', (request: Request, response: Response, next: NextFunction) => {
    passport.authenticate('google', (error, user, info) => {
        if(error){
            return next(error)
        }
        if(user){
            request.logIn(user, (error) => {
                if(error){
                    return next(error)
                }
                response.redirect('http://localhost:3000')
            })
        }
    })(request, response, next)
})


export default googleRoute