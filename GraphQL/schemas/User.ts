import { gql } from 'apollo-server-core'

export const User = gql`
    type Country{
        name: String
        code: String
    }

    type ExtraInfo{
        field: String
        value: String
    }

    type User{
        email: String
        typeEmail: String
        firstName: String
        lastName: String
        password: String
        image: String
        country: Country
        # ! TODO: Change it to Date
        birthDate: String
        extraInfo: [ExtraInfo!]
        favoriteOffices: [Office]!
    }
`