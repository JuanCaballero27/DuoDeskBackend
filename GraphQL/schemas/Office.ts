import { gql } from 'apollo-server-core'

export const Office = gql`
    type Location{
        description: String
        # coordinates: {
        #     latitude: Float!
        #     longitude: Float!
        # }
        isExact: Boolean!
    }

    type Amenities{
        amenity: String!
        description: String!
    }

    type Address{
        street: String!
        city: String!
        state: String!
        country: String!
        countryCode: String!
        zip: String
        location: Location!
    }

    type Space{
        idSpace: ID!
        name: String!
        typeSpace: String!
        people: Int!
        description: String!
        priceHour: Float
        priceDay: Float
        priceWeek: Float
        currency: String
        availability:Int!
        amenities: [Amenities]!
    }

    type Score{
        averageScore: Float!
        reviews: [Review]!
    }

    type Image{
        url: String!
        description: String!
    }

    type Day{
        day: String!
        isAvailable: Boolean!
        startHour: String
        endHour: String
    }

    type Office{
        id: ID!
        name: String!
        description: String!
        host: ID!
        isActive: Boolean!
        spaces: [Space!]!
        address: Address!
        scores: Score
        mainImage: String
        images: [Image!]!
        days: [Day!]!
        daysForCancellation: Int
    }
`