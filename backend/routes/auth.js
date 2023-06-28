const router = require("express").Router();
const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

//REGISTER A STUDENT
router.post("/register",async (req,res)=>{  
   try{
    //create new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //create new student
    const newStudent = new Student({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
       });

    //saved user response
    const student = await newStudent.save()
    res.status(200).json(student);
   }catch(err){
    res.send(403).json("new student was not created")
   }
})

//LOGIN
router.post("/login", async(req,res)=>{
    try {
        const { email, password } = req.body;
    // check if the email is registered
        const user = await Student.findOne({ email });
        if (!user) {
            throw new Error('Email or password is incorrect');
        }
    // compare the password with the hashed password in the db
        const isMatch = await bcrypt.compare(password, user.password);
        !isMatch && res.status(400).json("wrong Email or password")
       res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;