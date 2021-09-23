const { gql } = require('apollo-server-core')

const Review = gql`
    type Comment{
        comment: String!
        score: Int!
        rentedOffice: Boolean!
        #! TODO: Change this for Date Type
        created: String!
    }

    type Review{
        id: ID!
        idOffice: Office!
        idUser: User!
        comments: [Comment]!
    }
`
module.exports = Review