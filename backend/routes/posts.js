const router = require("express").Router()
const { response } = require("express")
const Post = require("../models/Post")

//create a post
router.post("/", async (req,res)=>{
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save(
            res.status(200).json("saved Post successfully")
        )
    }catch(err) {
        res.send(500).json("you were not able to post your message")
    }
})

//to update a post
router.put(".:/id", async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
    if (post.studentId === req.body.studentId){
        await post.updateOne({$set:req.body})
        res.status(200).json("post upated succesfully")
    } else {
        res.status(403).json("you can update only your post")
    }
} catch(err){
    res.status(500).json(err);
}
})
//to delete a post
router.delete(".:/id", async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
    if (post.studentId === req.body.studentId){
        await post.deleteOne()
        res.status(200).json("post deleted succesfully")
    } else {
        res.status(403).json("sorry ,you cannot delete this post!")
    }
} catch(err){
    res.status(500).json(err);
}
})
// to like/dislike a post
router.put =("/:id/like", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.studentIdId)){
            await post.updateOne({$push: {likes:req.body.studentId} })
            response.status(200).json("Post liked successfully")
        } else{
            await post.updateOne({$pull: {likes:req.body.studentId} })
            response.status(200).json("Post disliked successfully")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

//get a post from the server
router.get('/:id', async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch(err){
        res.sendStatus(500).json(err)
    }
})

// get timeline posts 
router.get('/timeline/:studentId' , async (req, res) =>{
    try {
        const currentStudent = await Student.findById(req.params.studentId)
        const studentPosts = await Post.find({studentId: currentStudent.id})
    const friendPosts = await Promise.all(
    currentStudent.followings.map((friendId) => {
        Post.find({studentId: friendId}) 
        })  
        )
        res.status(200).json(studentPosts.concat(...friendPosts))
    } catch (err){
        res.status(500).json(err)
    }
}
)
module.exports = router;