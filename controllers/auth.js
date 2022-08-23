const {UserModel, validateReg, validateLog} = require('../models/userModel');
const bcrypt = require('bcrypt');
const { otpHandler } = require('../utils/mail');

exports.registerUser = async(req,res) => {
    try {
        const {error} = validateReg(req.body)
        if(error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const {username,password,firsname,lastname} = req.body
        const exists = await UserModel.findOne({username: username})
        if(exists){
            return res.status(400).json({message: "User already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password,salt)
        const newUser = new UserModel({username,password: hashedPass,firsname,lastname})
        newUser.save()
        .then((result) => {
            otpHandler(result,res)
        })
        .catch((err) => {
            console.log(err)
            res.json({message: err.message})
        })
    }
    catch (error){
        res.status(500).json({message: error.message})
    }
}

exports.loginUser = async(req,res) => {
    const {username,password} = req.body;

    try {
        const {error} = validateLog(req.body)
        
        if(error) return res.status(400).json({message: error.details[0].message})

        const user = await UserModel.findOne({username: username})

        if(!user) return res.status(401).json({message: "Invalid Credentials"})

        const chkverify = user.verified

        if(!chkverify) return res.status(401).json({message: "Verify your email"}) 

        const valid = await bcrypt.compare(password,user.password)

        if(!valid) return res.status(401).json({message: "Invalid Credentials"})

        const token = user.generateAuthToken()

        res.status(200).json({data: token,message: "Logged in successfully"})
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}


