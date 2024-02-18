import Joi from "joi";
import Refresh from "../models/refreshToken.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/JwtService.js";
import { REFRESH_SECRET } from "../config/index.js";
import User from "../models/user.js";

const refreshController = {
  async refresh(req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    //Datbase
    let refresh_token;
    let access_token;
    try {
      refresh_token = await Refresh.findOne({ token: req.body.refresh_token });
      if (!refresh_token) {
        return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token"));
      }
      //Verify Token
      let userId;
      try {
        const { _id } = await JwtService.verify(
          refresh_token.token,
          REFRESH_SECRET
        );
        userId = _id;
      } catch (error) {
        return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token"));
      }
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return next(CustomErrorHandler.unAuthorized("No User Found"));
      }
      //Now Generates the token
       access_token = JwtService.sign({ _id: user._id, role: user.role });
       refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      await Refresh.create({ token: refresh_token });
      res.json({ access_token, refresh_token });
    } catch (error) {
      return next(error);
    }
  },
};
export default refreshController;
