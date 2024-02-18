import User from "../models/user.js"
import CustomErrorHandler from "../services/CustomErrorHandler.js"

const admin =async (req,res,next)=>{
    try {
        const user=await User.findOne({_id:req.user._id})
        console.log(user.role);
        if(user.role==='admin'){
            next()
        }
        else{
            return next(CustomErrorHandler.unAuthorized())
        }
    } catch (error) {
        return next(CustomErrorHandler.serverError())
    }
}
export default admin 