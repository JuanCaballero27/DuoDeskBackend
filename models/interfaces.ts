import { Document, PopulatedDoc } from 'mongoose'

export interface IUser {
    provider?: string,
    email: string,
    typeEmail: string | undefined,
    firstName: string,
    lastName: string,
    password: string | undefined,
    image: string,
    country?: {
        name: string
        code: string
    }
    birthDate: Date,
    createdDate: Date,
    extraInfo: [{
        field: string,
        value: string | number | boolean
    }]
    favoritesOffices: PopulatedDoc<IOffice & Document>[],
    bookings?: {
        idHost: PopulatedDoc<IUser & Document>,
        idUser: PopulatedDoc<IUser & Document>,
        idOffice: PopulatedDoc<IOffice & Document>,
        idTransaction?: string,
        startDate: string,
        endDate: string,
        people: number,
        priceSubtotal: number,
        priceTotal: number,
        dateReservation: number | Date,
        state: string
    }[]
}

export interface IOffice {
    name: string,
    description: string,
    host: PopulatedDoc<IUser & Document>,
    isActive: boolean,
    generalAmenities: string[]
    spaces: {
        nameSpace: string,
        typeSpace: string,
        capacitySpace: number,
        availableSpace: number,
        hourPrice: number,
        dayPrice: number,
        weekPrice: number,
        monthPrice: number,
        nameAmenities: string[],
        imagesUrls: string[],
        isActive: boolean,
        bookings?: {
            idHost: PopulatedDoc<IUser & Document>,
            idUser: PopulatedDoc<IUser & Document>,
            idOffice: PopulatedDoc<IOffice & Document>,
            idTransaction?: string,
            startDate: string,
            endDate: string,
            people: number,
            priceSubtotal: number,
            priceTotal: number,
            dateReservation: number | Date,
            state: string,
            isActive: boolean
        }[]
    }[],
    address: any,
    scores?: {
        averageScore: number,
        reviews: PopulatedDoc<IReview & Document>
    },
    days: [{
        day: string,
        isAvailable: boolean,
        startHour?: string,
        endHour?: string
    }],
    notifications: string[],
    official: string[],
    openDate: string
}


export interface IReview {
    idOffice: PopulatedDoc<IOffice & Document>,
    idUser: PopulatedDoc<IUser & Document>,
    comments: [{
        comment: string,
        score: number,
        rentedOffice: boolean,
        created: Date
    }]
}
