import express, { Request, Response, NextFunction, request } from 'express'
import passport from 'passport'
import { encryptPassword } from '../../utils/functions'
import User from '../../models/User'

const localRouter = express.Router()

localRouter.post('/login', (request: Request, response: Response, next: NextFunction) => {
    passport.authenticate('local', (error, user, info) => {
        if(error){
            console.log(error)
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

localRouter.post('/signup', (request: Request, response: Response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    User.findOne({email: request.body.email}, async (error: any, user: any) => {
        if(error){
            response.status(500).send(error)
        }
        if(user){
           response.status(400).send('The user already existis') 
        }
        else{
            try {
                const newUser = new User({
                    email: request.body.email,
                    firstName: request.body.firstName,
                    lastName: request.body.lastName,
                    birthDate: new Date(Number(request.body.birthDate) * 1000)
                })
                const password = await encryptPassword(request.body.password)
                newUser.password = password
                newUser.save()
                response.status(201).json({
                    password: password,
                    body: request.body.password,
                    message: 'Hello world'
                })
            } catch (error) {
                response.send(error)
            }
        }
    })
})

localRouter.get('/signup', (request: Request, response: Response) => {
    console.log(request.get('origin'))
    response.send("Hello world")
})

export default localRouter