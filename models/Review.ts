import { Schema, model } from 'mongoose'
import { IReview } from './interfaces'

const reviewSchema = new Schema<IReview>({
    idOffice: {type: Schema.Types.ObjectId, ref:'Office'},
    idUser: {type: Schema.Types.ObjectId, ref: 'User'},
    comments: [{
        comment: {type: String},
        score: {type: Number, min: 1, max: 5},
        created: {type: Date, default: Date.now()}
    }]
})

reviewSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString()
        delete returnedDocument._id
        delete returnedDocument._v
    }
})

module.exports = model<IReview>('Review', reviewSchema)