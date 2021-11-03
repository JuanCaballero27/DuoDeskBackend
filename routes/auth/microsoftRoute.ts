import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'

const microsoftRoute = express.Router()

microsoftRoute.get('/auth', passport.authenticate('microsoft'))
microsoftRoute.get('/callback', (request: Request, response: Response, next: NextFunction) => {
    passport.authenticate('microsoft', (error, user, info) => {
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
export default microsoftRoute