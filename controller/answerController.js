
// db connection
const dbConnection=require("../db/dbConfige")
const {StatusCodes}=require("http-status-codes")

async function answers (req,res){
    const userid=req.user.userid
     
    const {answer}= req.body
    if(!answer){
     return res.status(StatusCodes.BAD_REQUEST).json({msg:"please provide the required fields" })
    }
 
    try {
const queid=req.params.questionid
        
 await dbConnection.query("INSERT INTO answers(userid,questionid,answer) value(?,?,?)",[userid,queid,answer])
 return res.status(StatusCodes.CREATED).json({msg:"answer Inserted"})
 
     
    } catch (error) {
     console.log(error.message);
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Something went wrong"})
 }
}





module.exports=answers