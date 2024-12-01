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


dotenv.config()
ConnectDB()

///MIDDLEWARES
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
}));

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json());


app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/user',userRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/others',otherRoutes)




app.listen(5000,()=>{
    console.log("server started successfully")
})
