import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const connecttoDb= async ()=>{
    try {
        const connection=await mongoose.connect(process.env.MONGO_URI);
        console.log('database connected successfully')
    } catch (error) {
        console.log(error)
    }
}
export default connecttoDb;