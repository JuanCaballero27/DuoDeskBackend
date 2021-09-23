const { User } = require('./User')
const { Office } = require('./Office')
const { Booking } = require('./Booking')
const { Review } = require('./Review')
const { gql } = require('apollo-server-core')

const Query = gql`
    type Query{
        sayHi: String
    }
`

const typeDefs = [
    Query,
    User,
    Office,
    Booking,
    Review,
]

export default typeDefs