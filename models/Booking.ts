import { Schema, model } from 'mongoose'
import { IBooking } from './interfaces'

const bookingSchema = new Schema<IBooking>({
    idOffice: {type: Schema.Types.ObjectId, ref: 'Office'},
    idHost: {type: Schema.Types.ObjectId, ref: 'User'},
    idUser: {type: Schema.Types.ObjectId, ref: 'User'},
    nameSpace: {type: String},
    created: {type: Date, default: new Date(Date.now())},
    transaction: {
        status: {type: String},
        expirationDate: {type: Date},
        price: {type: Number},
        total: {type: Number},
        currency: {type: String},
    },
    interval: {
        startDate: {type: Date},
        endDate: {type: Date},
    }
})

bookingSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString()
        delete returnedDocument._id
        delete returnedDocument._v
    }
})

module.exports = model<IBooking>('Booking', bookingSchema)