import mongoose from "mongoose";

const schema=mongoose.Schema;

const refreshTokenSchema=new schema({
    token:{type:String,unique:true}
},{timestamps:false})
const Refresh =mongoose.model('RefreshToken',refreshTokenSchema)
export default Refresh 