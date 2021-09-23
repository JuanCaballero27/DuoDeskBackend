import { Schema, model } from 'mongoose'
import { IOffice } from './interfaces'

const officeSchema = new Schema<IOffice>({
    name: {type: String},
    description: {type: String},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    isActive: {type: Boolean},
    spaces: [{
        name: {type: String},
        typeSpace: {type: String},
        people: {type: Number},
        description: {type: String},
        priceHour: {type: Number},
        priceDay: {type: Number},
        priceWeek: {type: Number},
        currency: {type: String},
        availability: {type: Number},
        amenities: [{
            amenity: {type: String},
            description: {type: String}
        }],
    }],
    address: {
        street: {type: String},
        city: {type: String},
        state: {type: String},
        country: {type: String},
        countryCode: {type: String},
        zip: {type: String},
        location: {
            description: {type: String},
            coordinates: {
                latitude: {type: Number},
                longitude: {type: Number},
            },
            isExact: {type: Boolean}
        }
    },
    scores: {
        averageScore: {type: Number},
        reviews: [{
            idReview: {type: Schema.Types.ObjectId},
            ref: 'Review'
        }]
    },
    mainImage: {type: String},
    images: [{
        url: {type: String},
        description: {type: String},
    }],
    days: [{
        day: {type: String},
        isAvailable: {type: Boolean},
        startHour: {type: String},
        endHour: {type: String}
    }],
    daysForCancellation: {type: Number, min: 1},
})

officeSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString()
        delete returnedDocument._id
        delete returnedDocument._v
    }
})

module.exports = model<IOffice>('Office', officeSchema)