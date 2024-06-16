const express=require("express")
const router=express.Router()

// question controller

const authMiddleware= require("../middleware/authmiddleware") 

const questions=require('../controller/questionController')
const search=require("../controller/questionController")
// authentication middleware

router.post('/all-questions', authMiddleware,questions)

module.exports=router 