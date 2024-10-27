const mongoose=require('mongoose')

const MemberSchema = mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String
    },
    role:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const Members = mongoose.model('Members', MemberSchema)
module.exports=Members