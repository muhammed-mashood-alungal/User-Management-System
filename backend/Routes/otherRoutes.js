const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')
const Members = require("../Models/Members")

router.get('/validateJWT',async(req,res)=>{
try{
  const token=req.cookies.token
 console.log(token)
   if(!token){
     return res.status(401).json({msg:"Please Login to access home page"})
   }

  const decoded = jwt.verify( token , process.env.JWT_SECRET_KEY) 
  if(!decoded){
    return res.status(401).json({msg:"Please Login to access home page"})
  }else{
    let userData = await Members.findOne({_id:decoded.id})
    userData={  
        id:userData.id,
        name:userData.name,
        email:userData.email,
        image:userData.image ? userData.image : ""
    }
    isAdmin = decoded.role == "admin" ? true : false
    res.status(200).json({result:userData,isAdmin})
  }
} catch(err){
  return res.status(401).json({msg:"Please Login to access home page"})
}
})
router.get('/logout',(req,res)=>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
          res.status(200).json()
    }catch(err){
        console.log(err)
        res.status(400).json({msg:"something Went Wrong Please Try Again"})
    }
        
 
    
   
})

module.exports=router