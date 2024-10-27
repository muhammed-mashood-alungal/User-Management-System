const express = require('express')
const { getAllUsers, deleteUser } = require('../Controller/adminController')
const { doLogin } = require('../Controller/userController')
const router=express.Router()

router.get('/all-users',(req,res)=>{
    getAllUsers().then((users)=>{ 
        res.status(200).json({users:users})
    }).catch((err)=>{
        res.status(400).json({msg:err})
    })
})
router.delete('/delete-user/:id',(req,res)=>{
    deleteUser(req.params.id).then(()=>{
        console.log("deleted")
        res.status(200).json({status:true})
    }).catch(()=>{
        console.log("error occured")
        res.status(400).json({status:false})
    })
})
router.post('/login',(req,res)=>{
    doLogin(req.body).then((response)=>{
         res.cookie('token',response.token,{
            httpOnly:true,
             secure:true
          })
          res.json({user:response.user}).status(200)
    }).catch((err)=>{
        res.status(400).json({msg:err})
    })
})
module.exports=router