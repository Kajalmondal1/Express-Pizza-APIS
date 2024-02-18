import express from 'express'
import dotenv from 'dotenv'
import { PORT,DB_URL } from './config/index.js'
import router from './routes/index.js'
import errorHandler from './middlewares/errorHandler.js'
import connectDB from './dbConnect.js/connection.js'
import cors  from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config()
global.appRoot=path.resolve(__dirname)
const app=express()
connectDB(DB_URL)
app.use(cors());
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use('/uploads',express.static('uploads'))
app.use('/api',router)
app.use(errorHandler)
app.listen(PORT,()=>{
    console.log(`servers started at port no ${PORT}`);
})

