import Joi from "joi"
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import User from "../models/user.js";
import Refresh from "../models/refreshToken.js";
import bcrypt from  'bcrypt'
import JwtService from "../services/JwtService.js";
import { REFRESH_SECRET } from "../config/index.js";
const registerController ={
    async register(req,res,next){
        // console.log(req.body,"KAKAK");
        // validation
        const registerSchema=Joi.object({
            name:Joi.string().min(3).max(30).required(),
            email:Joi.string().email().required(),
            password:Joi.string().min(3).max(30).required(),
            repeat_password:Joi.ref('password')
        })
        const {error}=registerSchema.validate(req.body)
        
        if(error){
            return next(error)
        }
        //Validation Completed
        
        // /Check if user already exists or not
        try { 
            const exist=await User.exists({email:req.body.email})
            if(exist){
                return next(CustomErrorHandler.alreadyExist("This email is already taken"))
            } 
        } catch (error) {
            return next(error)
        }
        
        //HAsh PAssword
        const hashedPAssword=await bcrypt.hash(req.body.password,10)
        
        //Prepare the model
        const {name,email,password}=req.body
        
        let access_token;
        let refresh_token;
        try {
            const user=new User({
                name:name,
                email:email,
                password:hashedPAssword,
            })
            const result=await user.save()
            access_token=JwtService.sign({_id:result._id,role:result.role})
            refresh_token=JwtService.sign({_id:result._id,role:result.role},'1y',REFRESH_SECRET)
            //DataBase Whitelist
            let x=  await Refresh.create({token:refresh_token})
            //create({token:refresh_token})
            
            // console.log(x);

        } catch (error) {
            return next(error)
        }

        res.json({access_token:access_token,refresh_token:refresh_token})
    }
}

export default registerController