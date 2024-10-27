const Members = require("../Models/Members")

module.exports={
    getAllUsers(){
        return new Promise((resolve, reject)=>{
            Members.find({role:"user"}).then((users)=>{
                resolve(users)
            }).catch((err)=>{
                reject("Internal Error Occured. Please Try Again...")
            })
        })
    },
    deleteUser(userId){
        return new Promise((resolve,reject)=>{
            Members.deleteOne({_id:userId}).then(()=>{
                resolve()
            }).catch((err)=>{
                reject(err)
            })
        })
    }
}