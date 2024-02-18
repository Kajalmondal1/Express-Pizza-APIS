import express from 'express'
import registerController from '../controllers/registerController.js'
import loginController from '../controllers/loginController.js'
import userController from '../controllers/userController.js'
import auth from '../middlewares/auth.js'
import refreshController from '../controllers/refreshController.js'
import productController from '../controllers/productController.js'
import admin from '../middlewares/admin.js'
const router =express.Router()

router.post('/register',registerController.register)
router.post('/login',loginController.login)
router.get('/me',auth,userController.me)
router.post('/refresh',refreshController.refresh)
router.post('/logout',auth,loginController.logout)
router.post('/product',[auth,admin],productController.store)
router.put('/product/:id',[auth,admin],productController.update)
router.delete('/product/:id',[auth,admin],productController.destroy)
router.get('/products',productController.index)
router.get('/product/:id',productController.show)

export default router