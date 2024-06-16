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




  module.exports= questions