import express from "express"
import multer from 'multer'
import fs from 'fs'
import mongoose from 'mongoose'

import dotenv from 'dotenv'
dotenv.config()

import { v2 as cloudinary } from 'cloudinary'

import Office from '../../models/Office'
import { isAuth } from '../../middleware/authMiddleware'

const officesRouter = express.Router()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `./public/uploads/offices/`
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        cb(null, dir)
    },
    filename: (req, file, cb) => cb(null, file.originalname.toString().toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^\w\-]^.+/g, '')
        .replace(/\-\-+/g, '')
        .replace(/^-+/, '')
        .replace(/-+$/, ''))
})
const uploader = multer({ storage })


officesRouter.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const query = Office.find()
        if (request.query.city) {
            query.setQuery({
                'address.address_components':
                {
                    $elemMatch: {
                        "types": { $in: ['political'] },
                        'short_name': request.query.city,
                        'long_name': request.query.city,
                    }
                }
            })
        }
        query.populate('host').exec((error, docs) => {
            if (error) {
                response.status(500).send(error)
            }
            let finalDocs = docs
            if (request.query.type) {
                finalDocs = finalDocs.filter((element) => {
                    element.spaces = element.spaces.filter((space) => {
                        if (space.typeSpace === request.query.type && space.isActive) {
                            return true
                        }
                        return false
                    })
                    if (element.spaces.length > 0) {
                        if (element.isActive) {
                            return true
                        }
                        return false
                    }
                    return false
                })
            }
            if (request.query.date && request.query.people) {
                const compareDate = new Date(request.query.date.toString())
                finalDocs = finalDocs.filter((office) => {
                    const openDate = new Date(office.openDate)
                    if (+compareDate >= +openDate) {
                        office.spaces = office.spaces.filter((space) => {
                            if (["Oficina privada", "Sala de conferencias"].includes(space.typeSpace)) {
                                if (space.bookings && space.bookings?.length > 0) {
                                    return false
                                }
                                return true
                            }
                            else if (["Escritorio personal", "Espacio abierto"].includes(space.typeSpace)) {
                                if (space.bookings && space.bookings?.length > 0) {
                                    let full = 0
                                    let available = 0
                                    for (let booking of space.bookings) {
                                        full += booking.people
                                        const bookingStartDate = new Date(booking.startDate)
                                        const bookingEndDate = new Date(booking.endDate)
                                        if (+bookingEndDate < +compareDate || +bookingStartDate > +compareDate) {
                                            available++
                                        }
                                    }
                                    if (full < space.capacitySpace && (space.capacitySpace - full) < Number(request.query.people) && available > 0) {
                                        return true
                                    }
                                    else {
                                        return false
                                    }
                                }
                                else {
                                    return true
                                }
                            }
                        })
                        if (office.spaces.length > 0) {
                            return true
                        }
                    }
                    return false
                })
                response.json(finalDocs)
            }
            else {
                response.json(finalDocs)
            }
        })
    } catch (error) {
        response.status(500).send(error)
    }
})

officesRouter.get('/user', isAuth, async (request: express.Request, response: express.Response) => {
    const user = JSON.parse(JSON.stringify(request.user))
    const offices = await Office.find({ host: new mongoose.Types.ObjectId(user.id) })
    return response.status(200).json(offices)
})

officesRouter.get('/:id', async (request: express.Request, response: express.Response) => {
    try {
        const { id } = request.params
        const office = await Office.findById(id).populate('host')
        if (office) {
            let finalDoc = office
            if (request.query.date && request.query.people) {
                const compareDate = new Date(request.query.date.toString())
                const openDate = new Date(office.openDate)
                finalDoc.spaces = finalDoc.spaces.map((space) => {
                    if (space.isActive) {
                        if (["Oficina privada", "Sala de conferencias"].includes(space.typeSpace)) {
                            if (space.bookings && space.bookings?.length > 0) {
                                space.isActive = false
                            }
                        }
                        else if (["Escritorio personal", "Espacio abierto"].includes(space.typeSpace)) {
                            if (space.bookings && space.bookings?.length > 0) {
                                let full = 0
                                let available = 0
                                for (let booking of space.bookings) {
                                    full += booking.people
                                    const bookingStartDate = new Date(booking.startDate)
                                    const bookingEndDate = new Date(booking.endDate)
                                    if (+bookingEndDate < +compareDate || +bookingStartDate > +compareDate) {
                                        available++
                                    }
                                }
                                if (!(full < space.capacitySpace && (space.capacitySpace - full) < Number(request.query.people) && available > 0)) {
                                    space.isActive = false
                                }
                            }
                        }
                    }
                    return space
                })
            }
            response.status(200).json(finalDoc)
        }
        else{
            response.status(404).send('Not Found')
        }
    }
    catch (error) {
        response.status(500).send(error)
    }
})

officesRouter.post('/', uploader.any(), isAuth, async (request: express.Request, response: express.Response) => {
    try {
        const data = JSON.parse(JSON.stringify(request.body))
        data.location = JSON.parse(data.location)
        const user: any = request.user
        if (data.spaces.length !== 1 && Array.isArray(data.spaces)) {
            data.spaces = data.spaces.map((element: any) => {
                const { spaceImages, ...rest } = JSON.parse(element)
                return JSON.parse(element)
            })
        }
        else {
            data.spaces = JSON.parse(data.spaces)
        }
        const newOffice = new Office({
            name: data.title,
            host: user.id || user._id,
            description: data.description,
            address: data.location,
            spaces: data.spaces,
            official: data.official,
            notifications: data.notifications,
            openDate: data.openDate,
            generalAmenities: data.generalAmenities.split(','),
            days: []
        })

        for (let space of newOffice.spaces) {
            space.imagesUrls = []
        }

        if (request.files) {
            for (let image of JSON.parse(JSON.stringify(request.files))) {
                const url = image.originalname.split('-', 2)
                const cloudinaryPath = url[0] + '/' + url[1]
                const result = await cloudinary.uploader.upload(image.path, { public_id: cloudinaryPath + image.originalname.split('-', 3)[0] + String(Date.now()) }).catch((error) => {
                    fs.unlinkSync(image.path)
                    return response.status(500).send(error)
                })
                if (result) {
                    fs.unlinkSync(image.path)
                    newOffice.spaces = newOffice.spaces.map((element) => {
                        if (element.nameSpace.replace(/\s/g, '').toLowerCase() === url[1]) {
                            element.imagesUrls = [...element.imagesUrls, JSON.parse(JSON.stringify(result)).secure_url]
                        }
                        return element
                    })

                }
            }
        }

        newOffice.days.push({
            day: 'Week',
            isAvailable: true,
            startHour: data.weekSchedule[0],
            endHour: data.weekSchedule[1]
        })

        if (data.saturdaySchedule) {
            newOffice.days.push({
                day: 'Saturday',
                isAvailable: true,
                startHour: data.saturdaySchedule[0],
                endHour: data.saturdaySchedule[1]
            })
        }

        if (data.sundaySchedule) {
            newOffice.days.push({
                day: 'Sunday',
                isAvailable: true,
                startHour: data.sundaySchedule[0],
                endHour: data.sundaySchedule[1]
            })
        }

        try {
            const res = await newOffice.save()
            response.status(201).json(res)
        } catch (error) {
            response.send(error)
        }
    }
    catch (error) {
        response.status(500).send('Ha sucedido un error. Lo sentimos mucho. Intentalo más tarde o reportalo')
    }
})

officesRouter.put('/', isAuth, uploader.any(), async (request: express.Request, response: express.Response) => {
    const data = JSON.parse(JSON.stringify(request.body))
    data.location = JSON.parse(data.location)
    const user: any = request.user
    if (data.spaces.length !== 1 && Array.isArray(data.spaces)) {
        data.spaces = data.spaces.map((element: any) => {
            return JSON.parse(element)
        })
    }
    else {
        data.spaces = JSON.parse(data.spaces)
    }

    const office = await Office.findById(request.body.id)
    if (office) {
        if (office.host.toString() !== user.id) {
            return response.status(403).json({
                error: 'Nu autorizado',
                message: 'La oficina que estás tratando de modificar no te pertenece.'
            })
        }
        office.set({
            name: data.title,
            host: user.id || user._id,
            description: data.description,
            address: data.location,
            spaces: data.spaces,
            official: data.official,
            notifications: data.notifications,
            generalAmenities: data.generalAmenities.split(','),
            days: []
        })

        for (let space of office.spaces) {
            if (!space.imagesUrls[0].startsWith('https://res.cloudinary.com/duodesk')) {
                space.imagesUrls = []
            }
        }

        if (request.files) {
            for (let image of JSON.parse(JSON.stringify(request.files))) {
                const url = image.originalname.split('-', 2)
                const cloudinaryPath = url[0] + '/' + url[1]
                const result = await cloudinary.uploader.upload(image.path, { public_id: cloudinaryPath + image.originalname.split('-', 3)[0] + String(Date.now()) }).catch((error) => {
                    fs.unlinkSync(image.path)
                    return response.status(500).send(error)
                })
                if (result) {
                    fs.unlinkSync(image.path)
                    office.spaces = office.spaces.map((element) => {
                        if (element.nameSpace.replace(/\s/g, '').toLowerCase() === url[1]) {
                            element.imagesUrls = [...element.imagesUrls, JSON.parse(JSON.stringify(result)).secure_url]
                        }
                        return element
                    })

                }
            }
        }

        office.days.push({
            day: 'Week',
            isAvailable: true,
            startHour: data.weekSchedule[0],
            endHour: data.weekSchedule[1]
        })

        if (data.saturdaySchedule) {
            office.days.push({
                day: 'Saturday',
                isAvailable: true,
                startHour: data.saturdaySchedule[0],
                endHour: data.saturdaySchedule[1]
            })
        }

        if (data.sundaySchedule) {
            office.days.push({
                day: 'Sunday',
                isAvailable: true,
                startHour: data.sundaySchedule[0],
                endHour: data.sundaySchedule[1]
            })
        }

        try {
            await office.save()
            response.status(201).json({
                error: null,
                message: 'Oficina actualizada correctamente',
                data: office._id
            })
        } catch (error) {
            response.send(error)
        }
    }
    else {
        response.status(404).json({
            error: 'No encontrado',
            message: 'La oficina solicitada no ha sido encontrada'
        })
    }
})

officesRouter.put('/toggle', isAuth, async (request: express.Request, response: express.Response) => {
    try {
        const user = JSON.parse(JSON.stringify(request.user))
        const office = await Office.findOne({
            host: new mongoose.Types.ObjectId(user.id),
            _id: new mongoose.Types.ObjectId(request.body.office)
        })
        if (office && office.spaces) {
            if (request.body.space) {
                if (office.isActive) {
                    office.spaces = office.spaces.map((space) => {
                        if (space.nameSpace === request.body.space) {
                            space.isActive = !space.isActive
                        }
                        return space
                    })
                }
                else {
                    return response.status(400).json({
                        error: 'Solicitud erronea',
                        message: 'El estado de un espacio solo puede ser alterado sí la oficina está activa'
                    })
                }
            }
            else {
                office.isActive = !office.isActive
                for (let space of office.spaces) {
                    space.isActive = office.isActive
                }
            }
            await office.save()
            return response.status(201).json({
                error: null,
                message: 'Estado actualizado correctamente'
            })
        }
        else {
            return response.status(404).json({
                error: 'No encontrado',
                message: 'No se ha encontrado la oficina'
            })
        }
    }
    catch (error) {
        response.status(500).send(error)
    }
})

officesRouter.delete('/:office', isAuth, async (request: express.Request, response: express.Response) => {
    const { office } = request.params
    const mongoOffice = await Office.findById(office)
    if (mongoOffice) {
        const id = JSON.parse(JSON.stringify(request.user)).id
        if (id !== mongoOffice.host.toString()) {
            return response.status(401).json({
                error: 'Sin autorización',
                message: 'Usuario no autorizado'
            })
        }
        await mongoOffice.delete()
        return response.status(200).json({
            error: null,
            message: 'Oficina eliminada correctamente'
        })
    }

})

officesRouter.delete('/:office/:space', isAuth, async (request: express.Request, response: express.Response) => {
    const { office, space } = request.params
    const mongoOffice = await Office.findById(office)
    if (mongoOffice) {
        const id = JSON.parse(JSON.stringify(request.user)).id
        if (id !== mongoOffice.host.toString()) {
            return response.status(401).json({
                error: 'Sin autorización',
                message: 'Usuario no autorizado'
            })
        }
        if (mongoOffice.spaces.length > 1) {
            mongoOffice.spaces = mongoOffice.spaces.filter((element) => {
                return element.nameSpace !== space
            })
            await mongoOffice.save()
        }
        else {
            await mongoOffice.delete()
        }
        return response.status(200).json({
            error: null,
            message: 'Espacio eliminado correctamente'
        })
    }
    return response.status(404).json({
        error: null,
        message: 'Oficina no encontrada'
    })
})

export default officesRouter