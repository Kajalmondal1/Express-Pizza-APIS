import Joi from "joi"
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import User from "../models/user.js";
import bcrypt from  'bcrypt'
import JwtService from "../services/JwtService.js";
import { REFRESH_SECRET } from "../config/index.js";
import Refresh from "../models/refreshToken.js";
const loginController={
    async login(req,res,next){
        const loginSchema=Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().min(3).max(30).required(),
        })
        
        const {error}=loginSchema.validate(req.body)
        if(error){
            return next(error)
        }
        try {
            const user=await User.findOne({email:req.body.email})
            console.log(user);
            if(!user){
                return next(CustomErrorHandler.wrongCredentials())
            }
            //Compare the password
            const match=await bcrypt.compare(req.body.password,user.password)
            if(!match){
                return next(CustomErrorHandler.wrongCredentials())
            }

            //Token Generation

            const access_token= JwtService.sign({_id:user._id,role:user.role})
            const refresh_token=JwtService.sign({_id:user._id,role:user.role},'1y',REFRESH_SECRET)
            //DataBase Whitelist
             await Refresh.create({token:refresh_token})
            res.json({access_token:access_token,refresh_token:refresh_token})
        } catch (error) {
            return next(error)
        }
    },
    async logout(req,res,next){
        //Validation
        const logoutSchema=Joi.object({
            refresh_token:Joi.string().required(),
        })
        const {error}=logoutSchema.validate(req.body)
        if(error){
            return next(error)
        }
        try {
             await Refresh.deleteOne({token:req.body.refresh_token})
        } catch (error) {
            return next(new Error('Something went wrong in the database'))
        }
        res.json({status:1})
    }
}

export default loginController