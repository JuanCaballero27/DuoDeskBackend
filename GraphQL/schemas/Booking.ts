import { gql } from 'apollo-server-core'

export const Booking = gql`
    type Interval{
        startDate: String!
        endDate: String!
    }

    type Transaction{
        status:  String!
        #! TODO: Change this for Date Type
        expirationDate: String!
        price:  Float!
        total:  Float!
        currency:  String!
    }

    type Booking{
        idOffice: Office! 
        idHost: User!
        idUser: User!
        idSpace: ID!
        #! TODO: Change this for Date Type
        created: String!
        #! TODO: Change this for Date Type
        interval: Interval!
    }
`