const mongoose = require('mongoose')

   const ConnectDB=async()=>{
   console.log(process.env.MONGO_URI)
    mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log('Connected to MongoDB successfully');
          })
          .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
          });
   }     
module.exports= {ConnectDB}