const express = require('express');
const AuthController = require('../controllers/auth')
const loginUser = require('../controllers/auth')


const router = express.Router();

router.post('/register',AuthController.registerUser)
router.get('/login',AuthController.loginUser)

module.exports = router
