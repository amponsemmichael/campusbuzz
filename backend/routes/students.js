
const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import the Student model
const Student = require("../models/Student");

//update students details
router.put("/:id", async (req,res) =>{
    if (req.body.studentId === req.params.id || req.body.isAdmin) {
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }catch(err){
        return res.status(403).json("err")
        } 
        }
        try{
            const student = await Student.findByIdAndUpdate(req.params.id, 
                {$set: req.body,      
            })
            res.status(200).json("Account has been updated")
        }catch(err){
            return res.status(403).json("err")
        }
    } else {
        return res.status(403).json("You can update your account only")
    }
})

//delete a user
router.delete("/:id",async (req,res) => {
    if(req.body.studentId === req.params.id || req.body.isAdmin){
        try{
        await Student.findByIdAndRemove(req.params.id)
        return res.status(200).json("Account has been deleted");
        }   catch(err){
          return  res.status(500).json(err)
        }
    }else {
        return res.status(403).json(
            "You can delete only your account!"
        )
    }
});

// Get students from the media app
router.get("/:id", async (req, res) =>{
   try{
    const {password,updatedAt, ...other} =
    user._doc
    res.status(200).json(other)
   }catch (err){
    res.status(500).json(err)
   }    
})

//follow a student
router.put("/:id/follow" , async(req,res) =>{
    if(req.body.studentId !== req.params.id){
        try{
            const student = await Student.findById(req.params.id)
            const currentStudent = await Student.findById(req.body.studentId)
            if(!student.followers.includes(req.body.studentId)){
                await student.updateOne({ $push: { followers: req.body.studentId}})
                await currentStudent.updateOne({ $push: { followings: req.body.studentId}})
                res.status(200).json("You've followed the student succesfully")
            }else{
                res.status(403).json("you already follow this student")
            }
        }catch (err){
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you cant follow yourself")
    }
})

//unfollow a user
router.put("/:id/unfollow" , async(req,res) =>{
    if(req.body.studentId !== req.params.id){
        try{
            const student = await Student.findById(req.params.id)
            const currentStudent = await Student.findById(req.body.studentId)
            if(student.followers.includes(req.body.studentId)){
                await student.updateOne({ $pull: { followers: req.body.studentId}})
                await currentStudent.updateOne({ $push: { followings: req.body.studentId}})
                res.status(200).json("You've unfollowed the student succesfully")
            }else{
                res.status(403).json("you are not following this student")
            }
        }catch (err){
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you unfollow yourself")
    }
})

module.exports = router;