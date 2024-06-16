const express=require("express")
const router=express.Router()
// authentication middleware
const authMiddleware= require("../middleware/authmiddleware") 
// usercontrollers
const {register,login,checkUser} =require('../controller/userController')

 // user register 
router.post("/register",register)

// login user
router.post("/login",login)
// check user
router.get("/check",authMiddleware, checkUser);


// forget password

// router.post('/forgetpass', forgetpass)

module.exports=router