import express from 'express'
import passport from 'passport'
import cors from 'cors'

import { isAuth } from './middleware/authMiddleware'

import config from './utils/config'
import connectToDatabase from './utils/dbconnect'

import './auth/googleAuth'
import './auth/facebookAuth'
import './auth/microsoftAuth'
import './auth/localAuth'

import googleRoute from './routes/auth/googleRoute'
import facebookRoute from './routes/auth/facebookRoute'
import microsoftRoute from './routes/auth/microsoftRoute'
import localRouter from './routes/auth/localRoute'

import officesRouter from './routes/offices/offices'
import userRouter from './routes/user/userRouter'
import cookieSession from 'cookie-session'

const app = express()
const URI = config.MONGODB_URI

app.use(express.static('public'))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}))
app.use(cookieSession({
    name: 'session',
    keys: ['Hello', 'World'],
    maxAge: 9999999 * 99999999 * 9999999
}))
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())

connectToDatabase(URI)

app.use('/google', googleRoute)
app.use('/facebook', facebookRoute)
app.use('/microsoft', microsoftRoute)
app.use('/auth', localRouter)
app.use('/offices', officesRouter)

app.use(isAuth)

app.get('/logout', (request: express.Request, response: express.Response) => {
    request.logOut()
    response.status(200).send('Logged Out')
})

app.use('/user', userRouter)

export default app
