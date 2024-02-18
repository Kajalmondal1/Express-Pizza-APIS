
import mongoose from 'mongoose';
import CustomErrorHandler from '../services/CustomErrorHandler.js';
const  connectDB =async (DATABASE_URL)=>{

   try {
    const db_option={
        dbName:"pizza"
    }
        await mongoose.connect(DATABASE_URL,db_option);
        console.log("connect Succssfully");
    } catch (err) {
        console.log(err);
    }
}

export default connectDB