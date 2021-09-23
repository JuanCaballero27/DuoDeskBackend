const { gql } = require('apollo-server-core')

const Booking = gql`
    type Interval{
        startDate: String!
        endDate: String!
    }

    type Transaction{
        status:  String!
        #! TODO: Change this for Date Type
        expirationDate: String!
        price:  Number!
        total:  Number!
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

module.exports = Booking