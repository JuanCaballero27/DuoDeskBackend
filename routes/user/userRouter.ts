import express, { request } from 'express'
import mongoose from 'mongoose'
import Office from '../../models/Office'
import User from '../../models/User'

const userRouter = express.Router()

userRouter.get('/', (request: express.Request, response: express.Response) => {
    if (request.user) {
        return response.json(request.user)
    }
    return response.status(401).send('Not authorized')
})

userRouter.put('/', (request: express.Request, response: express.Response) => {
    
})

userRouter.delete('/', async (request: express.Request, response: express.Response) => {
    const user = JSON.parse(JSON.stringify(request.user))
    await User.findByIdAndDelete(new mongoose.Types.ObjectId(user.id))
    await Office.deleteMany({ host: new mongoose.Types.ObjectId(user.id) })
    return response.status(204).json({
        error: null,
        message: 'Cuenta borrada exitosamente'
    })
})

export default userRouter