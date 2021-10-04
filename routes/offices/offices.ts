import express from "express"
import multer from 'multer'
import fs from 'fs'

import User from '../../models/User'

const officesRouter = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const url = file.fieldname.split('-', 3)
        const dir = `./public/uploads/offices/${url[0]}/${url[1]}/`
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
const upload = multer({ storage: storage })
const type = upload.any()

officesRouter.post('/', type, (request: express.Request, response: express.Response) => {
    
})

export default officesRouter