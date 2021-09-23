import express, {Request, Response} from 'express'
import passport from 'passport'
import session from 'express-session'

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

const isLogged = (request: ApiRequest, response: Response, next: Function): void => {
    request.user ? next() : response.status(401).send('Unauthorized')
}

app.use(session({ secret: 'cats' }))
app.use(passport.initialize())
app.use(passport.session())

connectToDatabase(URI)

app.get('/', (req: any, res: any) => {
    res.send(`
    <h1>Hello world!</h1>
    <a href="/google/auth">Auth with Google</a><br>
    <a href="/facebook/auth">Auth with Facebook</a><br>
    <a href="/microsoft/auth">Auth with Microsoft</a><br>
    <a href="/twitter/auth">Auth with Twitter</a><br>
    `)
})


app.use('/google', googleRoute)
app.use('/facebook', facebookRoute)
app.use('/microsoft', microsoftRoute)
app.use('/twitter', twitterRoute)

app.get('/logout', (request: ApiRequest, response: any) => {
    request.logout()
    request.session.destroy()
    response.send('Bye Friend')
})

app.get('/reject', (request: ApiRequest, response: any) => {
    response.json({error: 'Something went wrong'})
})

app.get('/acept', isLogged, (request: ApiRequest, response: Response) => {
    console.log(request.user)
    response.send(`Hello ${request.user.displayName}`)
})

export default app