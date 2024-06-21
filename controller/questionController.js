 // db connection
const dbConnection=require("../db/dbConfige")
const {StatusCodes}=require("http-status-codes")
const { v4: uuidv4 } = require('uuid');
uuidv4()
 
 async function questions(req,res){
    const userid=req.user.userid
    const queid=uuidv4()
   const{title,description}= req.body
   if(!title || !description ){
    return res.status(StatusCodes.BAD_REQUEST).json({msg:"please provide all required fields" })
   }

   try {
await dbConnection.query("INSERT INTO questions(title,description,questionid,userid) value(?,?,?,?)",[title,description,queid,userid])
return res.status(StatusCodes.CREATED).json({msg:"question Inserted"})

    
   } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Something went wrong"})
   }
 }

//  async function search(req,res){
//    try {
     
//         const {stringQuery}=req.body
//         result=await dbConnection.query("SELECT question.title, users.username FROM questions INNER users ON questions.userid=users.userid WHERE questions.title LIKE ? ",[`%${stringQuery}%`])
//         return res.status(StatusCodes.OK).json(result)
   
//    } catch (error) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"wrong trial"})
//    }
//   }

async function deleteQuestion(req, res) {
   // const userid = req.user.userid;
   console.log("delete question is called ***********");
   const questionid = req.params.questionid;
   console.log("questionid===> ", questionid);
   try {
     
       await dbConnection.query("DELETE FROM answers WHERE questionid = ?", [
         questionid,
       ]).then(async ()=>{
         const [result] = await dbConnection.query(
         "DELETE FROM questions WHERE questionid = ?",
         [questionid]
       );
       
       if (result.affectedRows > 0){
     // alert("Question deleted successfully");
     return res.status(200).json({ msg: "Question deleted successfully" });}
     else {
       return res.status(404).json({ msg: "not found" });
     }
       })
       
   } catch (error) {
     console.error("Error deleting question:", error);
     return res.status(500).json({ msg: "Something went wrong"});
 }
 }

 /// update question

 async function updateQuestion(req, res) {
  const { title, description } = req.body;
  const questionid = req.params.questionIdOnEdit;

  console.log("questionid ===>", questionid); // Debug log
  console.log("tittle ===>", title); // Debug log
  console.log("description ===>", description); // Debug log
  // Check if required information is provided
  if (!title || !description) {
    return res
      .status(400)
      .json({ msg: "Please provide all required information" });
  }

  try {
    // update the answer into the database
    const result = await dbConnection.query(
      "UPDATE  questions SET title = (?), description = (?) WHERE questionid = (?) ",
      [title, description, questionid]
    );

    return res.status(201).json({ msg: "Your question has been updated " });
  } catch (error) {
    console.error("Error updating question:", error.message);
    return res.status(500).json({ msg: "Something went wrong" });
}
}


  module.exports={questions,deleteQuestion, updateQuestion}