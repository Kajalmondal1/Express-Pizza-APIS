import Joi from "joi"
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import User from "../models/user.js";
import bcrypt from  'bcrypt'
import JwtService from "../services/JwtService.js";
const userController ={
    async me(req,res,next){
        try {
            const user=await User.findOne({_id:req.user._id}).select('-password -createdAt -updatedAt -__v')
            if(!user){
                return next(CustomErrorHandler.notFound())
            }
            res.json(user)
        } catch (error) {
            return next(error)
        }
    }
}
export default userController