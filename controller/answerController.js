
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

async function deleteAnswer(req, res) {
    console.log("delete answer");
    
    const answerid = req.params.answerid; 
    const userid = req.user.userid; 
  
    console.log("answerid===> ", answerid);
    // console.log("questionid===> ", questionid);
  
    try {
      // Check if the answer exists and if the user is the owner
      const [selectAnswer] = await dbConnection.query(
        "SELECT userid FROM answers WHERE  answerid = ?",
        [ answerid]
      );
  
      if (selectAnswer.length === 0) {
        return res.status(404).json({ msg: "Answer not found" });
      }
  
      const answerOwnerId = selectAnswer[0].userid;
  
      if (answerOwnerId !== userid) {
        return res
          .status(403)
          .json({ msg: "You are not authorized to delete this answer" });
      }
  
      // Proceed with deleting the answer
      const [result] = await dbConnection.query(
        "DELETE FROM answers WHERE answerid = ?",
        [ answerid]
      );
  
      if (result.affectedRows > 0) {
        return res.status(200).json({ msg: "Answer deleted successfully" });
      } else {
        return res.status(404).json({ msg: "Answer not found" });
      }
    } catch (error) {
      console.error("Error deleting answer:", error);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  }
  
  async function updateAnswer(req, res) {
    const { answer } = req.body;
   const answerid = req.params.answerIdOnEdit;
   console.log("answerid ===>", answerid)
    // Check if required information is provided
    if ( !answer) {
      return res
        .status(400)
        .json({ msg: "Please provide all required information" });
    }
  
    try {
      
      // update the answer into the database
      const result = await dbConnection.query(
        "UPDATE  answers SET answer = (?) WHERE answerid = (?) ",
        [answer, answerid]
      );
  
      return res.status(201).json({ msg: "Your answer has been updated " });
    } catch (error) {
      console.error("Error updating answer:", error.message);
      return res.status(500).json({ msg: "Something went wrong" });
 }
  }





module.exports={answers,deleteAnswer,updateAnswer}