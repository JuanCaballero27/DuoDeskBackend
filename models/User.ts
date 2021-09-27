import { Schema, model } from 'mongoose'
import { IUser } from './interfaces'

const userSchema = new Schema<IUser>({
    provider: {type: String},
    email: {type: String},
    typeEmail: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    password: {type: String},
    image: {type: String},
    country: {
        name: {type: String},
        code: {type: String},
    },
    createdDate: {type: Date, default: new Date(Date.now())},
    extraInfo: [{
        field: String,
        value: String,
    }],
    favoritesOffices: [{type: Schema.Types.ObjectId, ref: 'Office'}]
})

userSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString()
        delete returnedDocument._id
        delete returnedDocument._v
    }
})

export default model<IUser>('User', userSchema)