import { Document, PopulatedDoc } from 'mongoose'


export interface IBooking{
    idOffice: PopulatedDoc<IOffice & Document>,
    idHost: PopulatedDoc<IUser & Document>,
    idUser: PopulatedDoc<IUser & Document>,
    nameSpace: string,
    created: Date,
    transaction: {
        status: string,
        expirationDate: Date,
        price: number,
        total: number,
        currency: string,
    },
    interval: {
        startDate: Date
        endDate: Date
    }
}

export interface IUser{
    email: string,
    typeEmail: string | undefined,
    firstName: string,
    lastName: string,
    password: string | undefined,
    image: string,
    country: {
        name: string
        code: string
    }
    birthDate: Date,
    extraInfo: [{
        field: string,
        value: string | number | boolean 
    }]
    favoritesOffices: [PopulatedDoc<IOffice & Document>]
}

export interface IOffice{
    name: string,
    description: string,
    host: PopulatedDoc<IUser & Document>,
    isActive: boolean,
    spaces: [{
        name: string,
        typeSpace: string,
        people: number,
        description: string,
        priceHour: number,
        priceDay: number,
        priceWeek: number,
        currency: string,
        availability: number,
        amenities: [{
            amenity: string,
            description: string
        }]
    }],
    address: {
        street: string,
        city: string,
        state: string,
        country: string,
        countryCode: string,
        zip: string,
        location: {
            description: string,
            coordinates: {
                latitude: number,
                longitude: number,
            },
            isExact: boolean
        }
    },
    scores: {
        averageScore: number,
        reviews: PopulatedDoc<IReview & Document>
    },
    mainImage: string,
    images: [{
            url: string,
            description: string,
    }],
    days: [{
        day: string,
        isAvailable: boolean,
        startHour: string,
        endHour: string
    }],
    daysForCancellation: number,
}


export interface IReview{
    idOffice: PopulatedDoc<IOffice & Document>,
    idUser: PopulatedDoc<IUser & Document>,
    comments: [{
        comment: string,
        score: number,
        rentedOffice: boolean,
        created: Date
    }]
}
