import { Request, Response, NextFunction} from 'express'

export const isAuth = (request: Request, response: Response, next: NextFunction) => {
    if(!request.user){
        response.status(401).json({
            authenticated: false,
            message: 'User has not been authenticated'
        })
    } else {
        next()
    }
}