import express from "express"
import multer from 'multer'
import fs, { open } from 'fs'

import Office from '../../models/Office'
import { isAuth } from '../../middleware/authMiddleware'

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
            finalDocs = finalDocs.filter((element) => {
                element.spaces = element.spaces.filter((space) => {
                    if (space.typeSpace === request.query.type) {
                        return true
                    }
                    return false
                })
                if (element.spaces.length > 0) {
                    return true
                }
                return false
            })
            if (request.query.date && request.query.people) {
                const compareDate = new Date(request.query.date.toString())
                finalDocs = finalDocs.filter((office) => {
                    const openDate = new Date(office.openDate)
                    console.log(+compareDate >= +openDate)
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

officesRouter.get('/:id', async (request: express.Request, response: express.Response) => {
    try {
        const { id } = request.params
        const office = await Office.findById(id)
        if (office) {
            response.status(200).json(office)
        }
    }
    catch (error) {
        response.status(500).send(error)
    }
})

officesRouter.post('/', type, isAuth, async (request: express.Request, response: express.Response) => {
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
        }
        catch (error) {
        }
        finally {
        }

        try {
            const res = await newOffice.save()
            response.status(201).json(res)
        } catch (error) {
            response.send("Re mal mrk")
        }
    }
    catch (error) {
        response.status(500).send('Ha sucedido un error. Lo sentimos mucho. Intentalo más tarde o reportalo')
    }
})

export default officesRouter