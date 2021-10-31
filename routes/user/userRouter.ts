import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import fs from 'fs'

import dotenv from 'dotenv'
dotenv.config()

import { v2 as cloudinary } from 'cloudinary'

import Office from '../../models/Office'
import User from '../../models/User'

import { encryptPassword } from '../../utils/functions'
import multer from 'multer'

const userRouter = express.Router()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const url = file.fieldname.split('-', 3)
        const dir = `./public/uploads/user/`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.toString().toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^\w\-]^.+/g, '')
            .replace(/\-\-+/g, '')
            .replace(/^-+/, '')
            .replace(/-+$/, ''))
    }
})

const uploader = multer({ storage })

userRouter.get('/', async (request: express.Request, response: express.Response) => {
    const user = JSON.parse(JSON.stringify(request.user))
    const mongoUser = await User.findById(user.id)
    return response.json(mongoUser)
})

userRouter.put('/', async (request: express.Request, response: express.Response) => {
    try {
        const user = JSON.parse(JSON.stringify(request.user))
        const mongoUser = await User.findById(user.id)
        if (mongoUser) {
            mongoUser.set({
                // email: user.provider === 'local' ? request.body.email : user.email,
                firstName: request.body.firstName || user.firstName,
                lastName: request.body.lastName || user.lastName
            })
            if (request.body.email && mongoUser.get('provider') === 'local') {
                const emailUsers = await User.find({ email: request.body.email })
                if (emailUsers.length > 0) {
                    return response.status(400).json({
                        error: 'Error de datos',
                        message: 'Este email ya está en uso'
                    })
                }
                mongoUser.set({
                    email: user.provider === 'local' ? request.body.email : user.email,
                })
            }
            mongoUser.save()
        }
        return response.json(request.user)
    }
    catch (error) {
        return response.status(500).json({
            error: 'Error del servidor',
            message: 'Se produjo un error en el servidor'
        })
    }
})

userRouter.put('/password', async (request: express.Request, response: express.Response) => {
    if (request.user) {
        const user = JSON.parse(JSON.stringify(request.user))
        const mongoUser = await User.findById(user.id)
        const password = await encryptPassword(request.body.password)
        if (mongoUser) {
            mongoUser.password = password
            await mongoUser.save()
            request.body.email = mongoUser.email
            passport.authenticate('local', { session: true }, (error, user, info) => {
                if (error) response.status(500).send(error)
                if (!user) response.status(404).send('No existe dicho usuario')
                else {
                    request.login(user, (error) => {
                        if (error) return response.status(500).send(error)
                        return response.json(request.user)
                    })
                }
            })(request, response)
        }
    }
})

userRouter.put('/image', uploader.any(), async (request: express.Request, response: express.Response) => {
    if (request.files) {
        const file = JSON.parse(JSON.stringify(request.files))[0]
        const localPath = file.path
        const cloudinaryPath = JSON.parse(JSON.stringify(request.user)).id + '/' + localPath
        const result = await cloudinary.uploader.upload(localPath, { public_id: cloudinaryPath }).catch((error) => {
            fs.unlinkSync(localPath)
            return response.status(500).send(error)
        })
        if (result) {
            fs.unlinkSync(localPath)
            const user = await User.findById(JSON.parse(JSON.stringify(request.user)).id)
            if (user) {
                user.set({
                    image: JSON.parse(JSON.stringify(result)).secure_url
                })
                await user?.save()
            }
            return response.status(201).json({
                error: null,
                message: 'Imagen actualizada correctamente.',
            })
        }
    }
    else {
        const user = await User.findById(JSON.parse(JSON.stringify(request.user)).id)
        if(user){
            user.set({
                image: `https://avatars.dicebear.com/api/open-peeps/${Date.now()}.svg?face=smileBig`
            })
            await user.save()
        }
        return response.status(201).json({
            error: null,
            message: 'Imagen axtualizada correctamente'
        })
    }
})

userRouter.delete('/', async (request: express.Request, response: express.Response) => {
    const user = JSON.parse(JSON.stringify(request.user))
    await User.findByIdAndDelete(new mongoose.Types.ObjectId(user.id))
    await Office.deleteMany({ host: new mongoose.Types.ObjectId(user.id) })
    request.logOut()
    return response.status(204).json({
        error: null,
        message: 'Cuenta borrada exitosamente'
    })
})

export default userRouter