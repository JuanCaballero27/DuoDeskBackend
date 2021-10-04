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

const app = express()
const URI = config.MONGODB_URI

// const storage = multer.diskStorage({
//     destination: (request: Request, file, done) => {
//         done(null, 'public/uploads')
//     },
//     filename: (request: Request, file, done) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         done(null, file.fieldname + '-' + uniqueSuffix)
//     }
// })

// const upload = multer({ storage ,dest: __dirname + '/public/uploads/', limits: { fieldSize: 2 * 1024 * 1024 } });
// const type = upload.any()


app.use(express.json())
app.use(cors(), (request: Request, response: Response, next: NextFunction) => {
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next()
})
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cookieSession({
    name: 'session',
    keys: ['Hello', 'World'],
    maxAge: 9999999 * 99999999 * 9999999
}))
// app.use(csurf())
app.use(session({ secret: 'cats', cookie: { secure: false } }))
app.use(passport.initialize())
app.use(passport.session())

connectToDatabase(URI)

app.use('/google', googleRoute)
app.use('/facebook', facebookRoute)
app.use('/microsoft', microsoftRoute)
app.use('/auth', localRouter)
app.use('/offices', officesRouter)

app.get('/logout', (request: Request, response: any) => {
    request.logOut()
    response.status(200).send('Logged Out')
})

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

app.get(('/user/account'), (request: Request, response: Response) => {
    console.log(request.user)
    response.json(request.user)
})

app.get('/prueba', (request: Request, response: Response) => {
    console.log(request.session);
    response.cookie('Prueba', 'Cookies', { httpOnly: true }).redirect('http://localhost:3000')
})

export default app
