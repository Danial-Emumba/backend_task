require('dotenv').config();

const express = require('express');
const {sequelize} = require('../models')
const app = express();
const passport = require('passport')
const session = require('express-session')
const port = process.env.PORT || 5000;

//initializing passport facebook strategy
require('./auth/facebookAuth')();

app.use(express.json())

const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoute');
const verificationRouter = require('./routes/verification_routes')

//passport requirements
app.use(session({secret : "somesecretkey", resave : true, saveUninitialized : true}))
app.use(passport.initialize());
app.use(passport.session())


//router middleware
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tasks', taskRouter)
app.use('/api/v1', verificationRouter)

//use uploads folder for file upload
app.use('/uploads', express.static('uploads'));

//ejs for oauth views
app.set('view engine', 'ejs')



app.listen(port,async ()=>{
    console.log(`Server listening on http://localhost:5000`);
    await sequelize.authenticate();
    console.log("Database connected...");
})