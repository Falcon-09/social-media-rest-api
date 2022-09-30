const { default: mongoose } = require('mongoose')
const PostModel = require('../models/postModel')
const UserModel = require('../models/userModel')


// create new post
exports.createPost = async(req,res) => {
    const newPost = new PostModel(req.body)

    try {
        await newPost.save()
        res.status(200).json("Post created!")
    } 
    catch (error) {
        res.status(500).json(error)
    }
}

// get post
exports.getPost = async(req,res) => {
    const postId = req.params.id
    try {
        const post = await PostModel.findById(postId)
        if(post){
            res.status(200).json(post)
        }else{
            res.status(403).json("No Post")
        }
    }
    catch (error) {
        res.status(500).json(error)
    }
}


// upd post 
exports.updatePost = async(req,res) => {
    const postId = req.params.id

    const {userId} = req.body

    try {
        const post = await PostModel.findById(postId)

        if(post.userId === userId){
            await post.updateOne({$set: req.body})
            res.status(200).json("Post Updated")
        }else{
            res.status(403).json("Access Denied")
        }
    }
    catch (error) {
        res.status(500).json(error)
    }
}

// delete post 
exports.deletePost = async(req,res) => {
    const postId = req.params.id

    const {userId} = req.body

    try {
        const post = await PostModel.findById(postId)

        if(post.userId === userId){
            await post.deleteOne();
            res.status(200).json("Post deleted successfully")
        }else{
            res.status(403).json("Access Denied")
        }
    }
    catch (error) {
        res.status(500).json(error)
    }
}

// like post 
exports.likePost = async(req,res) => {
    const postId = req.params.id
    const {userId} = req.body
    try {
        const post = await PostModel.findById(postId)
        if(!post.likes.includes(userId)){
            await post.updateOne({$push: {likes: userId}})
            res.status(200).json("Post Liked")
        }else{
            await post.updateOne({$pull: {likes: userId}})
            res.status(200).json("Post Unliked")
        }
    }
    catch (error) {
        res.status(500).json(error)
    }
}

// timeline
exports.getTimelinePosts = async(req,res) => {
    const userId = req.params.id

    try {
        const currentUserPosts = await PostModel.find({userId: userId})
        const followingPosts = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingposts"
                }
            },
            {
                $project: {
                    followingposts: 1,
                    _id: 0
                }
            }
        ])

        res.status(200).json(currentUserPosts.concat(followingPosts[0].followingposts)
        .sort((a,b)=>{
            return b.createdAt - a.createdAt;
        })
        )
    }
    catch (error) {
        res.status(500).json(error)
    }
} 

