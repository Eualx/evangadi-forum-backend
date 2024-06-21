const express=require("express")
const router=express.Router()

// question controller

const authMiddleware= require("../middleware/authmiddleware") 

const {questions, deleteQuestion, updateQuestion}=require('../controller/questionController')


// authentication middleware

router.post('/all-questions', authMiddleware,questions)
router.delete('/delete/:questionid', authMiddleware, deleteQuestion)
// update question
router.post("/update-question/:questionIdOnEdit", updateQuestion)

// router.post('/quesearch', authMiddleware, search)
module.exports=router 