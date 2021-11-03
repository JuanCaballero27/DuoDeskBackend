import mongoose from 'mongoose'

const connectToDatabase = async (URI: string | undefined): Promise<void> => {
    if(typeof URI !== "undefined"){
        try{
            await mongoose.connect(URI)
            console.log('Connected to the DataBase')
        }catch(error){
            console.log(`There was an error: \n 
            ---------------
            ${error}
            ---------------
            `);
        }
    }
    else{
        console.log(`Upps, something went wrong`)
    }
}

export default connectToDatabase