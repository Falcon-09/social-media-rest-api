const {UserModel} = require('../models/userModel')
const bcrypt = require('bcrypt')

// get user
exports.getUser = async(req,res) => {
    const id = req.params.id

    try {
        const user = await UserModel.findById(id)

        if(user){

            const {password,...other} = user._doc

            res.status(200).json(other)
        }else{
            res.status(404).json("No such user")
        }
    }
    catch (error) {
        res.status(500).json(error)
    }
}

// upd user
exports.updateUser = async(req,res) => {
    const id = req.params.id
    const {currentUserId,adminStatus,password} = req.body

    if(id==currentUserId || adminStatus){
        
        try {

            if(password){
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(password,salt)
            }

            const user = await UserModel.findByIdAndUpdate(id,req.body,{new: true})
            res.status(200).json(user)
        }
        catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Access Denied")
    }
}

// del user

exports.deleteUser = async(req,res) => {
    const id = req.params.id
    const {currentUserId,adminStatus} = req.body
    if(id==currentUserId || adminStatus){

        try {

            const user = await UserModel.findByIdAndDelete(id)
            res.status(200).json("User Deleted Sucessfully")
        }
        catch (error) {
            res.status(500).json(error.message)
        }
    }else{
        res.status(403).json("Access Denied")
    }
}

// follow user

exports.followUser = async(req,res) => {
    const id = req.params.id

    const {currentUserId} = req.body

    if(currentUserId==id){
        res.status(403).json("Action Forbidden")
    }else{

        try {
            const followuser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)

            if(!followuser.followers.includes(currentUserId)){
                await followuser.updateOne({$push: {followers: currentUserId}})
                await followingUser.updateOne({$push: {following: id}})
                res.status(200).json("User Followed!")
            }else{
                res.status(403).json("User is already followed by you")
            }
        }
        catch (error) {
            res.status(500).json(error)
        }
    }
}

// unfollow user

exports.unFollowUser = async(req,res) => {
    const id = req.params.id

    const {currentUserId} = req.body

    if(currentUserId==id){
        res.status(403).json("Action Forbidden")
    }else{

        try {
            const followuser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)

            if(followuser.followers.includes(currentUserId)){
                await followuser.updateOne({$pull: {followers: currentUserId}})
                await followingUser.updateOne({$pull: {following: id}})
                res.status(200).json("User Unfollowed!")
            }else{
                res.status(403).json("User is not followed by you")
            }
        }
        catch (error) {
            res.status(500).json(error)
        }
    }
}