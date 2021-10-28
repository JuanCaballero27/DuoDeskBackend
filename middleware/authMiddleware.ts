import { Request, Response, NextFunction } from 'express'

export const isAuth = (request: Request, response: Response, next: NextFunction) => {
    console.log('USER', request.user)
    console.log('AUTH', request.isAuthenticated())
    if (!request.isAuthenticated()) {
        response.status(401).json({
            authenticated: false,
            message: 'User has not been authenticated'
        })
    }
    else{
        next()
    }
}