const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const OtpModel = require('../models/otpModel')


dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_MAIL,
        pass: process.env.AUTH_PASS
    }
})

const otpHandler = async(req,res) =>{
    const _id = req._id
    const username = req.username
    const otp = `${Math.floor(1000+Math.random()*9000)}`

    const mailOptions = {
        from: process.env.AUTH_MAIL,
        to: username,
        subject: "Verify Your Email",
        html: `<p> Enter <b>${otp}</b> in the app to verify your email address and complete the verification process</p>
        <p>This code <b>expires in 5 minutes</b>.</p>`
    }
    try {
        const salt = 10
        const hashedOtp = await bcrypt.hash(otp,salt)
        const newOtp = await new OtpModel({
            userId: _id,
            otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 300000
        })
        await newOtp.save()
        await transporter.sendMail(mailOptions)
        return res.status(201).json({status:"Pending",message: "Check your inbox"})
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {transporter,otpHandler}

