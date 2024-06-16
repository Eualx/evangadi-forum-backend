// db connection

const dbConnection=require("../db/dbConfige")
const bcrypt=require("bcrypt")
const {StatusCodes}=require("http-status-codes")
const jwt=require("jsonwebtoken")

async function register(req,res) {
    
    const{username, firstname, lastname, email, password}=req.body;
    if(!username|| !firstname||!lastname || !email || !password){
return res.status(StatusCodes.BAD_REQUEST).json({msg: "please provide the necessery information"})
    }


try {

    const [user]= await dbConnection.query("SELECT username, userid from users where username=? or email=?",[username, email])
   
    if(user.length>0){
       return res.status(StatusCodes.BAD_REQUEST).json({msg:"user already registed"})
    }
    if(password.length<=8){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"password must be atleast 8 characters"})  
    }
// encrypt the passcode

const salt =await bcrypt.genSalt(10)

const hashedpassword=await bcrypt.hash(password,salt)

    await dbConnection.query("INSERT INTO users (username, firstname, lastname, email, password) VALUES(?,?,?,?,?)",[username, firstname, lastname, email, hashedpassword])
return res.status(StatusCodes.CREATED).json({msg:"user Registerd"})

} catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"something went wrong, try again later"})
}
}

async function login(req,res) {
    // res.send("login")
    const {email, password}=req.body;
    if(!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"please enter all required fields"})
    }
    try {
        const [user]= await dbConnection.query("SELECT username, userid,password from users where  email=?",[email]) 
      if(user.length==0){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"please provide the correct email address"})
      }
      const isMatch= await bcrypt.compare(password,user[0].password);
      if(!isMatch){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"invalid password "})
      }
      const username= user[0].username
      const userid=user[0].userid
    //  const token= jwt.sign({username,userid},"secret",{expiresIn:"1d"})
     const token= jwt.sign({username,userid}, process.env.JWT_SECRET,{expiresIn:"1d"})
      return res.status(StatusCodes.OK).json({msg:"user login successful", token , username})
         
    } 
        catch (error) {
            console.log(error.message);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"something went wrong, try again later"})
    }
}
async function checkUser(req,res) {
    const username= req.user.username
    const userid=req.user.userid
    res.status(StatusCodes.OK).json({msg:"valid user", username,userid})
    // res.send("check User")
}




module.exports={register,login,checkUser}