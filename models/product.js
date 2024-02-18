import mongoose from "mongoose";
import {APP_URL} from '../config/index.js'
const schema=mongoose.Schema;

const productSchema=new schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    size:{type:String,required:true},
    image:{type:String,required:true,get:(image)=>{
        return `${APP_URL}${image}`
    }},
},{timestamps:true,toJSON:{getters:true},id:false})
const Product =mongoose.model('Product',productSchema)
export default Product 