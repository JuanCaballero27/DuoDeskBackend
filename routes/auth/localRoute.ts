import express, { Request, Response, NextFunction, request, response } from 'express'
import passport, { session } from 'passport'
import { encryptPassword } from '../../utils/functions'
import User from '../../models/User'

const localRouter = express.Router()

localRouter.post('/login', (request: Request, response: Response, next: express.NextFunction) => {
    passport.authenticate('local', { session: true }, (error, user, info) => {
        if (error) response.status(500).send(error)
        if (!user) response.status(404).send('No existe dicho usuario')
        else {
            request.login(user, (error) => {
                if (error) return response.status(500).send(error)
                return response.json(request.user)
            })
        }
    })(request, response, next)
})

localRouter.post('/signup', (request: Request, response: Response) => {
    User.findOne({ email: request.body.email, provider: 'local' }, async (error: any, user: any) => {
        if (error) {
            response.status(500).send(error)
        }
        if (user) {
            response.status(400).json({
                status: 400,
                message: 'Ya existe un usuario con dicho Email'
            })
        }
        else {
            try {
                const newUser = new User({
                    provider: 'local',
                    email: request.body.email,
                    firstName: request.body.firstName,
                    lastName: request.body.lastName,
                    birthDate: new Date(Number(request.body.birthDate) * 1000),
                    image: `https://avatars.dicebear.com/api/open-peeps/${request.body.email}.svg?face=smileBig`
                })
                const password = await encryptPassword(request.body.password)
                newUser.password = password
                newUser.save()
                response.status(201).send(true)
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