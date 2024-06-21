const express=require("express")
const router=express.Router()

// answer controller

const {answers,deleteAnswer,updateAnswer}= require("../controller/answerController")



// authentication middleware


router.delete('/deleteanswer/:answerid', deleteAnswer)
router.post('/update-answer/:answerIdOnEdit',updateAnswer)
router.post('/all-answer/:questionid', answers)

module.exports=router