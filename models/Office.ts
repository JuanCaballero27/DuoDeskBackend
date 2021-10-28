import { Schema, model } from 'mongoose'
import { IOffice } from './interfaces'

const officeSchema = new Schema<IOffice>({
    name: { type: String },
    description: { type: String },
    host: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
    generalAmenities: [{type: String}],
    spaces: [{
        nameSpace: { type: String },
        typeSpace: { type: String },
        capacitySpace: { type: Number },
        availableSpace: { type: Number },
        hourPrice: { type: Number },
        dayPrice: { type: Number },
        weekPrice: { type: Number },
        monthPrice: { type: Number },
        nameAmenities: [{ type: String }],
        imagesUrls: [{ type: String }],
        bookings: [{
            idHost:  { type: Schema.Types.ObjectId, ref: 'User' },
            idUser:  { type: Schema.Types.ObjectId, ref: 'User' },
            idOffice:  { type: Schema.Types.ObjectId, ref: 'Office' },
            idTransaction: { type: String },
            startDate: { type: String },
            endDate: { type: String },
            people: { type: Number },
            priceSubtotal: { type: Number },
            pricesTotal: { type: Number },
            dateReservation: { type: Number, default: Date.now() },
            state: { type: String },
            isActive: { type: Boolean, default: true}
        }]
    }],
    address: {},
    scores: {
        averageScore: { type: Number },
        reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
    },
    days: [{
        day: { type: String },
        isAvailable: { type: Boolean },
        startHour: { type: String },
        endHour: { type: String }
    }],
    notifications: [{type: String}],
    official: [{type: String}],
    openDate: {type: String}
})

officeSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString()
        delete returnedDocument._id
        delete returnedDocument._v
    }
})

export default model<IOffice>('Office', officeSchema)