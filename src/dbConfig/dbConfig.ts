import mongoose from "mongoose";
mongoose.connection.setMaxListeners(20); // To prevent MaxListeners warning
// Importing the mongoose library to interact with MongoDB
// and setting the maximum number of listeners to 20 to avoid warnings
// This is useful when you have multiple event listeners attached to the connection
export async function connect()
{
  try {
     mongoose.connect(process.env.MONGO_URL!);
     const connection = mongoose.connection;

     connection.on('connnected',()=>{
      console.log("connected");
     })

     connection.on('error',(error)=>{
      console.log(error);
     })

  } catch (error) {
     
    console.log("SomeThing gone wrong",error);

   }
}