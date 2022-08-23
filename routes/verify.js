const express = require('express')
const { verifyOtp, resendOtp } = require('../controllers/verify')
const router = express.Router()

router.post('/resend',resendOtp)
router.post('/',verifyOtp)


module.exports = router