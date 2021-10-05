import express from "express"
import multer from 'multer'
import fs from 'fs'

import User from '../../models/User'
import Office from '../../models/Office'

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

officesRouter.post('/', type, async(request: express.Request, response: express.Response) => {
    console.log(request.body)
    const data = JSON.parse(JSON.stringify(request.body))
    data.location = JSON.parse(data.location)
    // data.spaces = JSON.parse(data.spaces)
    if(data.spaces.length === 1){
        data.spaces = JSON.parse(data.spaces)
    }
    else{
        data.spaces = data.spaces.map((element: any) => {
            const { spaceImages, ...rest } = JSON.parse(element)
            console.log(JSON.parse(element))
            console.log(rest)
            return JSON.parse(element)
        })
    }
    const newOffice = new Office({
        name: data.title,
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

    if(data.saturdaySchedule){
        newOffice.days.push({
            day: 'Saturday',
            isAvailable: true,
            startHour: data.saturdaySchedule[0],
            endHour: data.saturdaySchedule[1]
        }) 
    }

    if(data.sundaySchedule){
        newOffice.days.push({
            day: 'Sunday',
            isAvailable: true,
            startHour: data.sundaySchedule[0],
            endHour: data.sundaySchedule[1]
        }) 
    }

    try{
        console.log(JSON.stringify(newOffice))
    }
    catch(error){
        console.log(newOffice)
    }
    finally{
        console.log('Antes del registro :0')
    }

    try {
        const res = await newOffice.save()
        response.status(201).json(res)
    } catch (error) {
        console.log(error)
        response.send("Re mal mrk")
    }

   
})

export default officesRouter