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
        imagesUrls: [{ type: String }]
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