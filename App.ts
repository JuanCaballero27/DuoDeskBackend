import express, {Request, Response} from 'express'
import passport from 'passport'
import session from 'express-session'

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

const app = express()
const URI = config.MONGODB_URI

interface ApiRequest extends Request{
    user?: any,
    session: any,
}

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cookieSession({
    name: 'session',
    keys: ['Hello', 'World'],
    maxAge: 9999999*99999999*9999999
}))
app.use(cors({
    origin: 'http://localhost:3000',
    allowedHeaders: 'http://localhost:3000',
    credentials: true,
}))
// app.use(csurf())
app.use(session({ secret: 'cats', cookie: {secure: false}}))
app.use(passport.initialize())
app.use(passport.session())

connectToDatabase(URI)

app.use('/google', googleRoute)
app.use('/facebook', facebookRoute)
app.use('/microsoft', microsoftRoute)
// app.use('/twitter', twitterRoute)
app.use('/auth', localRouter)

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

app.get(('/acept'), (request: Request, response: Response) => {
    console.log(request.user);
    response.json(request.user)
})

app.get('/prueba', (request: Request, response: Response) => {
    console.log(request.session);
    response.cookie('Prueba', 'Cookies', {httpOnly: true}).redirect('http://localhost:3000')
})

export default app