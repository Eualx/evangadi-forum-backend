require("dotenv").config()
const express=require("express")
const app=express()
const port = 5000
const cors= require("cors")
app.use(cors())
// db connection
const dbConnection=require("./db/dbConfige")


// user router middleware file
const userRoutes=require("./routes/userRoute")

// Question router middleware file
const questionRoutes=require("./routes/questionRoute")

// Answer router middleware file

const answerRoutes= require("./routes/answerRoute")

// authentication middle ware file
const authMiddleware = require("./middleware/authmiddleware")


// json middleware to extract json data
app.use(express.json())

// user routes middleware
app.use("/api/users",userRoutes)

// questionroutes middleware
// app.use("/api/questions?page=1&limit=10", authMiddleware ,questionRoutes)
app.use("/api/questions" , authMiddleware ,questionRoutes)
// answer route middleware
app.use("/api/answers", authMiddleware,answerRoutes)


app.get('/api/data/combined', async (req, res) => {
   

const query = `SELECT 
    questions.questionid, 
    questions.title, 
    questions.description, 
    users.username,
    questions.id
FROM 
    questions
INNER JOIN 
    users ON questions.userid = users.userid

    ORDER BY 
    questions.id DESC;
    `;

    // const searchQuery = `%${queryString}%`;
      // WHERE questions.title   LIKE '%what%'

    try {
      const [results] = await dbConnection.query(query);
      res.json(results);
    } catch (error) {
      res.status(500).send(error);
    }
  });


app.get('/api/data/combined/:questionid', async (req, res) => {
  const { questionid } = req.params;

    const query = `
    SELECT 
    answers.answer , users.username FROM answers INNER JOIN users ON answers.userid = users.userid WHERE questionid =? 
    ORDER BY 
   answers.answerid DESC;
   
  ` ;


  try {
    const [results] = await dbConnection.query(query, [questionid]);
    res.json(results);
  } catch (error) {
    res.status(500).send(error);
  }
});




// app.get('/api/data/combineddelet/:questionid', async (req, res) => {
//   const { questionid } = req.params;

//     const query = `
//     SELECT 
//     answers.answer , answers.answerid FROM answers INNER JOIN users ON answers.userid = users.userid WHERE questionid =? 
//     ORDER BY 
//    answers.answerid DESC;
   
//   ` ;


//   try {
//     const [results] = await dbConnection.query(query, [questionid]);
//     res.json(results);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

app.get('/api/data/combineddetail/:questionid', async (req, res) => {
  const { questionid } = req.params;

  const query = `
    SELECT  
      title, 
      description
    FROM 
      questions
    WHERE 
     questionid = ?

  `;

  try {
    const results = await dbConnection.query(query, [questionid]);
    res.send(results[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});






async function start(){
    try {
       const result= await dbConnection.execute("select 'test' ")
       app.listen(port)
       console.log("data based connection established");
       console.log(`listening on ${port}`);
    //    console.log(result);
    } catch (error) {
        console.log(error.message);
    }
}

start()





