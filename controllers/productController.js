import multer from "multer";
import Product from "../models/product.js";
import path from "path";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import Joi from "joi";
import fs from "fs";
import productSchema from "../validators/validator.js";
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("image"); //5mb

const productController = {
  async store(req, res, next) {
    //Multipart form data
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      // console.log(req.file);
      if (!req.file) {
        return next(CustomErrorHandler.serverError("Image is required"));
      }
      const filepath = req.file.path;
      console.log(filepath);
      //Validation
      //   const productSchema = Joi.object({
      //     name: Joi.string().required(),
      //     price: Joi.number().required(),
      //     size: Joi.string().required(),
      //   });
      const { error } = productSchema.validate(req.body);
      if (error) {
        // delete the uploaded file
        fs.unlink(`${appRoot}/${filepath}`, (err) => {
          return next(CustomErrorHandler.serverError(error.message));
        });
        return next(error);
      }
      const { name, price, size } = req.body;
      let document;
      try {
        document = await Product.create({
          name,
          price,
          size,
          image: filepath,
        });
      } catch (error) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },
  async update(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      let filepath;
      if (req.file) {
        filepath = req.file.path;
      }
      //Validation
      // const productSchema = Joi.object({
      //   name: Joi.string().required(),
      //   price: Joi.number().required(),
      //   size: Joi.string().required(),
      // });
      const { error } = productSchema.validate(req.body);
      if (error) {
        // delete the uploaded file
        if (req.file) {
          fs.unlink(`${appRoot}/${filepath}`, (err) => {
            return next(CustomErrorHandler.serverError(error.message));
          });
        }
        return next(error);
      }
      const { name, price, size } = req.body;
      let document;
      try {
        document = await Product.findOneAndUpdate({_id:req.params.id},{
          name,
          price,
          size,
          ...(req.file && {image: filepath})
        });
      } catch (error) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },
  async destroy(req,res,next){
    const document=await Product.findOneAndRemove({_id:req.params.id})
    if(!document){
      return next(new Error('Nothing to delete'))
    }
    //image delete
    const imagePath=document._doc.image
    fs.unlink(`${appRoot}/${imagePath}`,(err)=>{
      if(err){
        return next(CustomErrorHandler.serverError())
      }
    })
    res.json(document)
  },
  async index(req,res,next){
    let document
    try {
      document=await Product.find().select('-createdAt -updatedAt -__v')

    } catch (error) {
      return next(CustomErrorHandler.serverError())
    }
    return res.json(document)
  },
  async show(req,res,next){
    let document
    try {
       document=await Product.findOne({_id:req.params.id}).select('-createdAt -updatedAt -__v')
    } catch (error) {
      return next(CustomErrorHandler.serverError())
    }
    return res.json(document)
  }
};
export default productController;
