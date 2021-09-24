import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'

const facebookRoute = express.Router()

facebookRoute.get('/auth', passport.authenticate('facebook', {scope: ['email']}))

facebookRoute.get('/callback', (request: Request, response: Response, next: NextFunction) => {
    passport.authenticate('facebook', (error, user, info) => {
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
                response.redirect('http://localhost:3000')
            })
        }
    })(request, response, next)
})

export default facebookRoute