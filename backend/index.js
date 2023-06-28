//libraries
const express = require("express")
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet")
const morgan = require("morgan")
const dotenv = require("dotenv")
const studentRoute = require("./routes/students")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")

dotenv.config()
// mongDB connection
mongoose.connect(
    process.env.MONGO_URL,
    {useNewUrlParser:true},
    ()=>    {
    console.log("Connected to the MongoDB");
})

//middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan("common"));
app.use("/api/students", studentRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute); 

app.listen(3500, ()=>{
    console.log("server is running!");
})