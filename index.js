const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const AuthRoute = require('./routes/auth')
const UserRoute = require('./routes/user')
const PostRoute = require('./routes/post')
const VerifyRoute = require('./routes/verify')

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}));

dotenv.config()

mongoose.connect(process.env.MONGO_DB)
.then(() => app.listen(process.env.PORT,() => console.log("Listening")))
.catch((error) => console.log(error));

app.use('/auth',AuthRoute)
app.use('/user',UserRoute)
app.use('/post',PostRoute)
app.use('/verify',VerifyRoute)