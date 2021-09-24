import { gql } from'apollo-server-core'
import { User } from './User'
import { Office } from './Office'
import { Booking } from './Booking'
import { Review } from './Review'

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