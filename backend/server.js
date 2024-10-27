const express = require('express')
const app=express()
const cors=require('cors')
const dotenv= require('dotenv')
const path= require('path')
const morgan= require('morgan')
const cookieParser = require('cookie-parser')
const { ConnectDB } = require('./config')
const userRoutes = require('./Routes/userRoutes')
const adminRoutes = require('./Routes/adminRoutes')
const otherRoutes = require("./Routes/otherRoutes")
app.use(cors())
app.use(cookieParser())
dotenv.config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
ConnectDB()

app.use('/api/user',userRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/others',otherRoutes)
app.use(morgan('dev'))



app.listen(5000,()=>{
    console.log("server started successfully")
})
