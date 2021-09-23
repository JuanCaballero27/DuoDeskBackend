import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === "production"
    ?   process.env.MONGODB_URI
    :   process.env.NODE_ENV === "test"
        ?   process.env.MONGODB_TEST
        :   process.env.MONGODB_DEV

const config = {
    PORT,
    MONGODB_URI
}

export default config