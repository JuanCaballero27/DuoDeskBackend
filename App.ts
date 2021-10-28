import express, { NextFunction, request, Request, Response } from 'express'
import passport from 'passport'
import session from 'express-session'
import multer from 'multer'

import cors from 'cors'
import csurf from 'csurf'
import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser'

import { isAuth } from './middleware/authMiddleware'

import config from './utils/config'
import connectToDatabase from './utils/dbconnect'

import './auth/googleAuth'
import './auth/facebookAuth'
import './auth/microsoftAuth'
// import './auth/twitterAuth'
import './auth/localAuth'

import googleRoute from './routes/auth/googleRoute'
import facebookRoute from './routes/auth/facebookRoute'
import microsoftRoute from './routes/auth/microsoftRoute'
// import twitterRoute from './routes/auth/twitterRoute'
import localRouter from './routes/auth/localRoute'

import officesRouter from './routes/offices/offices'
import userRouter from './routes/user/userRouter'

const app = express()
const URI = config.MONGODB_URI

app.use(express.static('public'))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}))
app.use(express.urlencoded({ extended: true }))
app.use(cookieSession({
    name: 'session',
    keys: ['Hello', 'World'],
    maxAge: 9999999 * 99999999 * 9999999
}))
app.use(passport.initialize())
app.use(passport.session())

connectToDatabase(URI)

app.use('/google', googleRoute)
app.use('/facebook', facebookRoute)
app.use('/microsoft', microsoftRoute)
app.use('/auth', localRouter)
app.use('/offices', officesRouter)

app.use(isAuth)

app.get('/logout', (request: Request, response: any) => {
    request.logOut()
    response.status(200).send('Logged Out')
})

app.use('/user', userRouter)

export default app
