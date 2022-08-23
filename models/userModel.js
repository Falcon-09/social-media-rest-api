const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const joi = require('joi')
const passComplexity = require('joi-password-complexity')

dotenv.config()

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
        },
        password: {
            type: String,
        },
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        profilePicture : String,
        coverPicture: String,
        about: String,
        livesin: String,
        worksAt: String,
        followers: [],
        following: [],
        verified : {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

UserSchema.methods.generateAuthToken = () =>{
    const token = jwt.sign({_id: this._id},process.env.KEY,{expiresIn: "1d"})
    return token
}

const UserModel = mongoose.model("Users",UserSchema);

const validateReg = (data) => {
    const schema = joi.object({
        firstname: joi.string().min(3).required(),
        lastname: joi.string().min(3).required(),
        username: joi.string().min(3).required().email(),
        password: passComplexity().required()
    })

    return schema.validate(data)
}

const validateLog = (data) => {
    const schema = joi.object({
        username: joi.string().required().email(),
        password: joi.string().required()
    })

    return schema.validate(data)
} 

module.exports = {UserModel,validateReg,validateLog}