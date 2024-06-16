const express=require("express")
const router=express.Router()

// answer controller

const answers= require("../controller/answerController")



// authentication middleware


// router.post('/all-answer/', answers)


router.post('/all-answer/:questionid', answers)
module.exports=router