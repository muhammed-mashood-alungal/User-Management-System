const express = require('express');
const { doSignUp, doLogin, uploadImage, editUserInfo, deletePhoto } = require('../Controller/userController');
const router = express.Router()
const path=require('path')
const fs=require('fs')
const multer= require('multer')


//MULTER CONFIGURATION
const userProfileDir = path.join(__dirname, '../public/userProfiles');
const storage = multer.diskStorage({
  destination:function (req,file,cb){
    cb(null,userProfileDir)
  },
  filename:function (req,file,cb){
    cb(null,file.originalname)
  }
})

const upload = multer({storage:storage})

//API FOR USER SIGNUP
router.post('/signup',(req, res) => {
  upload.single("photo")(req,res,(err)=>{
    if(err){
      return res.status(500).json({ message: err });
    }
    doSignUp(req.body).then(async(response)=>{
    if(req.file){
      const uploadResult = await uploadImage(response.user.id,req.file.originalname)
      if(!uploadResult.status){
          return res.status(500).json({ message: uploadResult });
      }
      response.user.image=uploadResult.image
    } 
    if(!req.body.adminCreated){
      res.cookie('token',response.token,{
        httpOnly:true,
        secure:true
      })
    }
     
      res.json({user:response.user}).status(200)
    }).catch((err)=>{
      if(err.message){
        res.status(400).json({msg:err.message})
      }else{
        res.status(500).json({msg:"Internal Error . Please Try Again"})
      }
    })
  })
   
    
});

/// API FOR BOTH ADMIN AND USER
router.post('/login',(req,res)=>{
  const loginData=req.body
  doLogin(loginData).then((response)=>{
    res.cookie('token',response.token,{
      httpOnly:true,
      secure:true
    })
    res.json({user:response.user}).status(200)
  }).catch((err)=>{
    res.status(400).json({msg:err})
  })
})

router.put("/edit/:id",(req,res)=>{
   upload.single("photo")(req,res,(err)=>{
    if(err){
      return res.status(500).json({ message: err });
    }
    
    if(req.body.photoDeleted){
      const filePath = path.join(__dirname, '../public/userProfiles',`${req.params.id}.png`);
      if(fs.existsSync(filePath)){
        deletePhoto(req.params.id,filePath)
      }
     
    }
    editUserInfo(req.params.id,req.body).then(async(response)=>{
    if(req.file){
      const uploadResult = await uploadImage(req.params.id,req.file.originalname)
      if(!uploadResult.status){
         console.log("error in uploading")
          return res.status(500).json({ message: uploadResult });
      }
      console.log(uploadResult.image)
      response.user.image=uploadResult.image
    }   
      console.log(response)
      res.json({user:response.user}).status(200)
    }).catch((err)=>{
      console.log(err)
      if(err){
        return res.status(400).json({msg:err})
      }else{
        console.log(err)
        return res.status(500).json({msg:"Internal Error . Please Try Again"})
      }
    })
  })
})
module.exports = router