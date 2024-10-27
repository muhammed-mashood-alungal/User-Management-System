const Members = require("../Models/Members")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const path=require('path')
const fs=require('fs')

module.exports={
    doSignUp(userData){
        return new Promise (async(resolve,reject)=>{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            userData={
                ...userData,
                role:"user",
                password:hashedPassword
            }
            
            Members.create(userData).then((inserted)=>{

                
                const secretKey = process.env.JWT_SECRET_KEY
                const token = jwt.sign({id:inserted._id,role:inserted.role},secretKey, { expiresIn: '1h' } )
                console.log(token)
                const response={
                    user:{
                        id:inserted._id,
                        name:userData.name,
                        email:userData.email
                    },
                    token
                }
               resolve(response)
            }).catch((err)=>{
                if (err.code === 11000 && err.keyPattern.email) {
                    reject({message:'Email already exists. Please use a different email.'})
                    
                  } else {
                    reject({message:'An error occurred during sign-up.Try Again'} )
                  }
            })
        })
    },
    doLogin({email,password}){
        console.log(email,password)
        return new Promise(async(resolve,reject)=>{
            const user = await Members.findOne({email})
            console.log(user)
            if(user){
                console.log('user exist')
                const isPassCorrect= await bcrypt.compare(password,user.password)
                console.log(isPassCorrect)
                if(!isPassCorrect){
                  
                    reject("invalid Creaditial")
                } else{
                    console.log("creating token...")
                    const secretKey = process.env.JWT_SECRET_KEY
                    const token = jwt.sign({id:user._id,role:user.role},secretKey, { expiresIn: '1h' } )
                    
                    const response={
                        user:{
                            id:user._id,
                            name:user.name,
                            email:user.email
                        },
                        token
                    }
                    
                    resolve(response)
                }
            }else{
                reject("invalid Credential")
            }
            
            
        })
    },
    uploadImage(userId,file){
        return new Promise((resolve,reject)=>{
            const oldPath=path.join(__dirname,`../public/userProfiles`,file)
            const newName=`${userId}${path.extname(file)}`
            const newPath=path.join(__dirname,`../public/userProfiles`,newName)
           
            
            fs.rename(oldPath,newPath,async(err)=>{
                if(err){
                    reject("Error While renaming file")
               
                }
               
                Members.updateOne({_id:userId},{$set:{image:newName}}).then(()=>{
                    let response={
                        status:true,
                        image:newName
                    }
                    resolve(response)
                }).catch(()=>{
                    reject("Error while updating")
                })
               
             })
             
        })

    },
    editUserInfo(userId,userData){
        return new Promise(async(resolve,reject)=>{
            if(userData.email){
                const isEmailExist = await Members.findOne({email:userData.email})
                if(isEmailExist){
                    return reject("Email with this User already exist")
                }
            }
            const updateData = {
                name: userData.name,
            }
            if (userData.email) {
                updateData.email = userData.email;
            }
          
             Members.updateOne({_id:userId},{$set:updateData}).then((user)=>{
             
                console.log(userId,userData,user)
                const response={
                    user:{
                        id:user.id,
                        name:user.name,
                        email:user.email
                    }
                }
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        })
    },
    async deletePhoto(userId,filePath){
        return new Promise (async(resolve,reject)=>{
            try {
                fs.unlinkSync(filePath);
                await Members.updateOne({_id:userId},{$unset:{image:""}})
                console.log('File deleted successfully');
                resolve()
                
              } catch (err) {
               reject(err)
              }
        })
           
    
    }
    
}