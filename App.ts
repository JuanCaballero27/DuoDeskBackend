import express, {Request, Response} from 'express'
import passport from 'passport'
import session from 'express-session'

import cors from 'cors'
import csurf from 'csurf'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'

import { isAuth } from './middleware/authMiddleware'

import config from './utils/config'
import connectToDatabase from './utils/dbconnect'

import './auth/googleAuth'
import './auth/facebookAuth'
import './auth/microsoftAuth'
import './auth/twitterAuth'

import googleRoute from './routes/auth/googleRoute'
import facebookRoute from './routes/auth/facebookRoute'
import microsoftRoute from './routes/auth/microsoftRoute'
import twitterRoute from './routes/auth/twitterRoute'

const app = express()
const URI = config.MONGODB_URI

interface ApiRequest extends Request{
    user?: any,
    session: any,
}

app.use(cookieSession({
    name: 'session',
    keys: ['Hello', 'World'],
    maxAge: 9999999*99999999*9999999
}))
app.use(cors({
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}))
// app.use(csurf())
app.use(session({ secret: 'cats' }))
app.use(passport.initialize())
app.use(passport.session())

connectToDatabase(URI)

app.use('/google', googleRoute)
app.use('/facebook', facebookRoute)
app.use('/microsoft', microsoftRoute)
app.use('/twitter', twitterRoute)

app.use(isAuth)

app.get('/', (req: any, res: any) => {
    res.send(`
    <h1>Hello world!</h1>
    <a href="/google/auth">Auth with Google</a><br>
    <a href="/facebook/auth">Auth with Facebook</a><br>
    <a href="/microsoft/auth">Auth with Microsoft</a><br>
    <a href="/twitter/auth">Auth with Twitter</a><br>
    `)
})



app.get('/logout', (request: ApiRequest, response: any) => {
    request.logout()
    request.session.destroy()
    response.send('Bye Friend')
})

app.get('/reject', (request: ApiRequest, response: any) => {
    response.json({error: 'Something went wrong'})
})

app.get('/acept', (request: ApiRequest, response: Response) => {
    console.log(request.user);
    response.send(`Hello ${request.user.displayName}`)
})

export default app